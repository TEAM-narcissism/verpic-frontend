
import React, { useCallback, useEffect, useRef, useState } from "react";

import ChatList from "./ChatList";
import CreateChat from "./CreateChat";

import tw from 'twin.macro';
import styled from '@emotion/styled';
import { conn, stompconn } from "../App";

import Cookies from 'universal-cookie';
import Timer from './Timer';



let localStream;
let localVideoTracks;
let myPeerConnection;

// 임시 변수
const localRoom = 3;
const cookies = new Cookies();


const ProgressBarWrapper = styled.div`
    font-family: 'NanumGothic-Bold';
    ${tw`container mt-10`}
`;

const ChatView = styled.div`
    font-family: 'NanumGothic-Regular';
    height: 840px;
    width: 600px;
    ${tw`mx-5 bg-gray-200 border rounded-lg my-10 flex flex-col justify-between`}
`;

const VideoWrapper = styled.div`
    ${tw`container text-center mx-auto`}
`;

const UserVideo = styled.video`
    height: 390px;   
    width: 520px;

    @media screen and (max-width: 500px) {
        height: 200px;
        width: 400px;
        flex-direction: column;
    }
    ${tw`bg-white border mx-10 my-10 `}
`;

const StudyStartText = styled.text`
    ${tw`text-xl text-center font-bold mt-10 p-3 text-gray-700`}
`;

function StudyChat() {
    const localUserName = localStorage.getItem("uuid")
    const myVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const chatRef = useRef(null)

    const peerConnectionConfig = {
        'iceServers': [
            { 'urls': 'stun:stun.stunprotocol.org:3478' },
            { 'urls': 'stun:stun.l.google.com:19302' },
        ]
    };


    const mediaConstraints = {
        audio: true,
        video: true
    };




    function stompWithSockJS() {
        stompconn.connect({ Authorization: cookies.get("vtoken") }, function (frame) {
            console.log('Websocket connection complete.');
            subscribe();
            chatSubscribe();
            chatUserSubscribe();
            stompconn.send('/pub/videochat/enter', { Authorization: cookies.get("vtoken") }, JSON.stringify({ matchId: localRoom }));
        });

    }

    const subscribe = () => {
        stompconn.subscribe('/sub/' + localUserName, function (frame) {
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
                    handleErrorMessage('Wrong type message received from server');
            }
        });

        sendToServer({
            from: localUserName,
            type: 'join',
            data: localRoom
        });

        stompconn.onclose = function (frame) {
            log('Socket has been closed');
        }

        stompconn.onerror = function (frame) {
            handleErrorMessage("Error: " + frame);
        };


    };

    function sendToServer(msg) {
        let msgJSON = JSON.stringify(msg);
        console.log(msg)
        stompconn.send("/pub/experiment", {}, msgJSON);

    }


    const [chatInputs, setChatInputs] = useState({
        message: '',
        sender: 'testsss'
    });

    const { message, sender } = chatInputs;

    const chatOnChange = useCallback(e => {
        const { name, value } = e.target;
        setChatInputs(chatInputs => ({
            ...chatInputs,
            [name]: value
        }));
    }, []);

    const [chats, setChats] = useState([
        {
            id: 1,
            sender: 'test_sender',
            message: '테스트용 메세지 입니다.'
        },
        {
            id: 2,
            sender: 'test_sender2',
            message: '두 번째 테스트용 메세지 입니다.'
        },
    ]);
    const nextChatId = useRef(3)

    const chatOnCreate = useCallback(() => {
        // 채팅 보내는 부분
        const chat = {
            id: nextChatId.current,
            message,
            sender,
        };

        stompconn.send('/pub/videochat/message', { Authorization: cookies.get("vtoken") }, JSON.stringify({ matchId: localRoom, message: message }));
        // setChats(chats => chats.concat(chat));

        setChatInputs({
            message: ''
        })
    }, [message, sender]);

    const [myName, setMyName] = useState("");

    const chatSubscribe = () => {
        stompconn.subscribe('/sub/videochat/' + localRoom, function (message) {
            var content = JSON.parse(message.body);
            console.log('chat subscribe');

            const chat = {
                id: nextChatId.current,
                message: content.message,
                sender: content.senderName
            }
            console.log(content)
            setChats(chats => chats.concat(chat))
            nextChatId.current += 1;
        });
    }

    const chatUserSubscribe = () => {
        stompconn.subscribe('/user/sub/videochat/' + localRoom, function (message) {
            var content = JSON.parse(message.body);
            console.log("개인 메세지", content.name);
            setMyName(content.name);
        });
    }

    function stop() {
        // send a message to the server to remove this client from the room clients list
        log("Send 'leave' message to server");
        sendToServer({
            from: localUserName,
            type: 'leave',
            data: localRoom
        });

        if (myPeerConnection) {
            log('Close the RTCPeerConnection');

            // disconnect all our event listeners
            myPeerConnection.onicecandidate = null;
            myPeerConnection.ontrack = null;
            myPeerConnection.onnegotiationneeded = null;
            myPeerConnection.oniceconnectionstatechange = null;
            myPeerConnection.onsignalingstatechange = null;
            myPeerConnection.onicegatheringstatechange = null;
            myPeerConnection.onnotificationneeded = null;
            myPeerConnection.onremovetrack = null;

            // Stop the videos

            if (remoteVideoRef.current.srcObject) {
                remoteVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }

            remoteVideoRef.current.src = null;


            if (myVideoRef.current.srcObject) {
                myVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            myVideoRef.current.src = null;

            myPeerConnection.close();
            myPeerConnection = null;

            log('Close the socket');
            if (conn != null) {
                conn.close();
            }
        }
    }

    /*
     UI Handlers
      */
    // mute video buttons handler
    /*
    videoButtonOff.onclick = () => {
        localVideoTracks = localStream.getVideoTracks();
        localVideoTracks.forEach(track => localStream.removeTrack(track));
        $(localVideo).css('display', 'none');
        log('Video Off');
    };
    videoButtonOn.onclick = () => {
        localVideoTracks.forEach(track => localStream.addTrack(track));
        $(localVideo).css('display', 'inline');
        log('Video On');
    };
    
    // mute audio buttons handler
    audioButtonOff.onclick = () => {
        localVideo.muted = true;
        log('Audio Off');
    };
    audioButtonOn.onclick = () => {
        localVideo.muted = false;
        log('Audio On');
    };
    
    // room exit button handler
    exitButton.onclick = () => {
        stop();
    };
    */
    function log(message) {
        console.log(message);
    }

    function handleErrorMessage(message) {
        console.error(message);
    }

    // use JSON format to send WebSocket message
    function sendToServer(msg) {
        let msgJSON = JSON.stringify(msg);

        stompconn.send("/pub/experiment", {}, msgJSON);

    }

    // initialize media stream
    // function getMedia(constraints) {
    //     if (localStream) {
    //         localStream.getTracks().forEach(track => {
    //             track.stop();
    //         });
    //     }
    //     navigator.mediaDevices.getUserMedia(constraints)
    //         .then(getLocalMediaStream).catch(handleGetUserMediaError);
    // }

    const getMedia = async (constraints) => {

        if (localStream) {
            localStream.getTracks().forEach(track => {
                track.stop();
            });
        }
        await navigator.mediaDevices.getUserMedia(constraints)
            .then(getLocalMediaStream).catch(handleGetUserMediaError);

    };




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
        if (myVideoRef.current) {
            myVideoRef.current.srcObject = mediaStream;
        }

        console.log('localStream:', localStream);
        localStream.getTracks().forEach(track => {
            myPeerConnection.addTrack(track, localStream)
        });
    }

    // handle get media error
    function handleGetUserMediaError(error) {
        log('navigator.getUserMedia error: ', error);
        switch (error.name) {
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

        stop();
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

        remoteVideoRef.current.srcObject = event.streams[0];

    }

    // WebRTC called handler to begin ICE negotiation
    // 1. create a WebRTC offer
    // 2. set local media description
    // 3. send the description as an offer on media format, resolution, etc
    function handleNegotiationNeededEvent() {
        myPeerConnection.createOffer().then(function (offer) {
            return myPeerConnection.setLocalDescription(offer);
        })
            .then(function () {
                sendToServer({
                    from: localUserName,
                    type: 'offer',
                    sdp: myPeerConnection.localDescription
                });
                log('Negotiation Needed Event: SDP offer sent');
            })
            .catch(function (reason) {
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
            myPeerConnection.setRemoteDescription(desc)
                .then(function () {
                    log("-- Creating answer");
                    return myPeerConnection.createAnswer();
                })
                .then(function (answer) {
                    log("-- Setting local description after creating answer");

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
        myPeerConnection.setRemoteDescription(message.sdp).catch(handleErrorMessage);
    }

    function handleNewICECandidateMessage(message) {
        let candidate = new RTCIceCandidate(message.candidate);
        log("Adding received ICE candidate: " + JSON.stringify(candidate));
        myPeerConnection.addIceCandidate(candidate).catch(handleErrorMessage);
    }

    let initLocalStream;
    //초기 비디오 설정. 내 얼굴 보이게! 내 목소리는 내가 안듣고싶어
    const getUserMediaReact = async () => {
        try {
            console.log('get my video .');
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            myVideoRef.current.srcObject = localStream;
            myVideoRef.current.muted = true;
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        stompWithSockJS();
        getUserMediaReact();

        //chatSubscribe();
        //stompconn.send('/pub/videochat/enter', {}, JSON.stringify({matchId: localRoom}));
    }, []);


    const videoButtonOff = () => {
        console.log('localStream:', localStream);

        myVideoRef.current.srcObject.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            console.log(track);
        })

    }
    const micButtonOff = () => {
        console.log('클릭');

        myVideoRef.current.srcObject.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            console.log(track);
        })


    }



    return (
        <VideoWrapper >

            <ProgressBarWrapper>
                <ul class="w-full steps">
                    <li class="step step-primary ">자기소개</li>
                    <li class="step step-primary">한국어세션</li>
                    <li class="step step-primary">영어세션</li>
                    <li class="step">마무리</li>
                </ul>

            </ProgressBarWrapper>

            <Timer></Timer>




            <div class="flex mb-3 mt-5">
                <div class="flex-col">
                    <div>회원님의 화면이에요.</div>
                    <div onClick={videoButtonOff} class="border rounded-lg p-3">Video Off</div>
                    <div onClick={micButtonOff} class="border rounded-lg p-3">Audio Off</div>
                    <UserVideo autoPlay playsInline ref={myVideoRef}></UserVideo>
                    <UserVideo autoPlay playsInline ref={remoteVideoRef}></UserVideo>
                </div>
                <div class="flex-col">
                    <ChatView ref={chatRef}>
                        <ChatList chats={chats} myName={myName} />
                        <CreateChat
                            message={message}
                            onChange={chatOnChange}
                            onCreate={chatOnCreate}
                        ></CreateChat>
                    </ChatView>
                </div>
            </div>
        </VideoWrapper>


    );

}

export default StudyChat;