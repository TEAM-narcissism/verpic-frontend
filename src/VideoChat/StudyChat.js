
import React, { useEffect, useRef, useState } from "react";
import * as StompJs from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

import VideoPlayer from './VideoPlayer';
import { Stomp } from '@stomp/stompjs';
import tw from 'twin.macro';
import styled from '@emotion/styled';

// 임시 변수
const localRoom = 3;

function StudyChat({uuid}) {
    const myVideoRef = useRef(null);


    const UserVideo = styled.video`
        height: 400px;   
        ${tw` hover: bg-gray-200 cursor-pointer border rounded-lg mx-10 my-10`}
    `;












    const peerConnectionConfig = {
        'iceServers': [
            {'urls': 'stun:stun.stunprotocol.org:3478'},
            {'urls': 'stun:stun.l.google.com:19302'},
        ]
    };

    const localUserName = uuid;

    const mediaConstraints = {
        audio: true,
        video: true
    };

    const localVideo = document.getElementById('local_video');
    const remoteVideo = document.getElementById('remote_video');

    let localStream;
    let localVideoTracks;
    let myPeerConnection;

    const conn = new SockJS('http://localhost:8080/ws-stomp');
    const stompconn = Stomp.over(conn);
    

    function stompWithSockJS() {
        stompconn.connect({}, function(frame){
            console.log('Websocket connection complete.');
            subscribe();
        });

    }
    
    const subscribe = () => {
        stompconn.subscribe('/sub/' + uuid, function(frame) {
            let message = JSON.parse(frame.body);
            switch (message.type) {
                case "text":
                    console.log('Text message from ' + message.from + ' received: ' + message.data);
                    break;

                case "offer":
                    console.log('Signal OFFER received');
                    handleOfferMessage(message);
                    break;

                case "answer":
                    console.log('Signal ANSWER received');
                    handleAnswerMessage(message);
                    break;

                case "ice":
                    console.log('Signal ICE Candidate received');
                    handleNewICECandidateMessage(message);
                    break;

                case "join":
                    console.log('Client is starting to ' + (message.data === "true" ? 'negotiate' : 'wait for a peer'));
                    handlePeerConnection(message);
                    break;

                default:
                   // handleErrorMessage('Wrong type message received from server');
            }
        });

        sendToServer({
            from: uuid,
            type: 'join',
            data: localRoom
        });
            
        
    };

    function sendToServer(msg) {
        let msgJSON = JSON.stringify(msg);

        console.log(msg)
        stompconn.send("/pub/experiment",{}, msgJSON);
    
    }
    function getMedia(constraints) {
        if (localStream) {
            localStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then(getLocalMediaStream).catch(handleGetUserMediaError);
    }
    
    // create peer connection, get media, start negotiating when second participant appears
    function handlePeerConnection(message) {
        createPeerConnection();
        getMedia(mediaConstraints);
        if (message.data === "true") {
            myPeerConnection.onnegotiationneeded = handleNegotiationNeededEvent;
        }
    }
    
    function createPeerConnection() {
        myPeerConnection = new RTCPeerConnection(peerConnectionConfig);
    
        // event handlers for the ICE negotiation process
        myPeerConnection.onicecandidate = handleICECandidateEvent;
        myPeerConnection.ontrack = handleTrackEvent;
    
        // the following events are optional and could be realized later if needed
        // myPeerConnection.onremovetrack = handleRemoveTrackEvent;
        // myPeerConnection.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
        // myPeerConnection.onicegatheringstatechange = handleICEGatheringStateChangeEvent;
        // myPeerConnection.onsignalingstatechange = handleSignalingStateChangeEvent;
    }
    // add MediaStream to local video element and to the Peer
    function getLocalMediaStream(mediaStream) {
        localStream = mediaStream;
        localVideo.srcObject = mediaStream;
        localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
    }



    
    // handle get media error
    function handleGetUserMediaError(error) {
        log('navigator.getUserMedia error: ', error);
        switch(error.name) {
            case "NotFoundError":
                alert("Unable to open your call because no camera and/or microphone were found.");
                break;
            case "SecurityError":
            case "PermissionDeniedError":
                // Do nothing; this is the same as the user canceling the call.
                break;
            default:
                alert("Error opening your camera and/or microphone: " + error.message);
                break;
        }
    
        //stop();
    }
    
    // send ICE candidate to the peer through the server
    function handleICECandidateEvent(event) {
        if (event.candidate) {
            sendToServer({
                from: localUserName,
                type: 'ice',
                candidate: event.candidate
            });
            log('ICE Candidate Event: ICE candidate sent');
        }
    }
    
    function handleTrackEvent(event) {
        log('Track Event: set stream to remote video element');
        remoteVideo.srcObject = event.streams[0];
    }
    
    // WebRTC called handler to begin ICE negotiation
    // 1. create a WebRTC offer
    // 2. set local media description
    // 3. send the description as an offer on media format, resolution, etc
    function handleNegotiationNeededEvent() {
        myPeerConnection.createOffer().then(function(offer) {
            return myPeerConnection.setLocalDescription(offer);
        })
            .then(function() {
                sendToServer({
                    from: localUserName,
                    type: 'offer',
                    sdp: myPeerConnection.localDescription
                });
                log('Negotiation Needed Event: SDP offer sent');
            })
            .catch(function(reason) {
                // an error occurred, so handle the failure to connect
                handleErrorMessage('failure to connect error: ', reason);
            });
    }
    
    function handleOfferMessage(message) {
        log('Accepting Offer Message');
        log(message);
        let desc = new RTCSessionDescription(message.sdp);
        //TODO test this
        if (desc != null && message.sdp != null) {
            log('RTC Signalling state: ' + myPeerConnection.signalingState);
            myPeerConnection.setRemoteDescription(desc).then(function () {
                log("Set up local media stream");
                return navigator.mediaDevices.getUserMedia(mediaConstraints);
            })
                .then(function (stream) {
                    log("-- Local video stream obtained");
                    localStream = stream;
                    try {
                        localVideo.srcObject = localStream;
                    } catch (error) {
                        localVideo.src = window.URL.createObjectURL(stream);
                    }
    
                    log("-- Adding stream to the RTCPeerConnection");
                    localStream.getTracks().forEach(track => myPeerConnection.addTrack(track, localStream));
                })
                .then(function () {
                    log("-- Creating answer");
                    // Now that we've successfully set the remote description, we need to
                    // start our stream up locally then create an SDP answer. This SDP
                    // data describes the local end of our call, including the codec
                    // information, options agreed upon, and so forth.
                    return myPeerConnection.createAnswer();
                })
                .then(function (answer) {
                    log("-- Setting local description after creating answer");
                    // We now have our answer, so establish that as the local description.
                    // This actually configures our end of the call to match the settings
                    // specified in the SDP.
                    return myPeerConnection.setLocalDescription(answer);
                })
                .then(function () {
                    log("Sending answer packet back to other peer");
                    sendToServer({
                        from: localUserName,
                        type: 'answer',
                        sdp: myPeerConnection.localDescription
                    });
    
                })
                // .catch(handleGetUserMediaError);
                .catch(handleErrorMessage)
        }
    }
    
    function handleAnswerMessage(message) {
        log("The peer has accepted request");
    
        // Configure the remote description, which is the SDP payload
        // in our "video-answer" message.
        // myPeerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp)).catch(handleErrorMessage);
        myPeerConnection.setRemoteDescription(message.sdp).catch(handleErrorMessage);
    }
    
    function handleNewICECandidateMessage(message) {
        let candidate = new RTCIceCandidate(message.candidate);
        log("Adding received ICE candidate: " + JSON.stringify(candidate));
        myPeerConnection.addIceCandidate(candidate).catch(handleErrorMessage);
    }
    

    function log(message) {
        console.log(message);
    }

    function handleErrorMessage(message) {
        console.error(message);
    }


    const getUserMedia = async() => {
        try {
         const stream = await navigator.mediaDevices.getUserMedia({video: true});
         myVideoRef.current.srcObject = stream;

        }catch(err) {
            log(err);
        }
    };

    useEffect( () => {
       // stompWithSockJS();
       getUserMedia();
    }, []);

    
    return (
        <div>
            실험 중이에요. 반갑습니다. {uuid}님.
            <div>
                <UserVideo  autoPlay ref={myVideoRef}>gg</UserVideo>
                <UserVideo id="remote_video" autoPlay playsInline>gg</UserVideo>
            </div>
        </div>
      );

}

export default StudyChat;