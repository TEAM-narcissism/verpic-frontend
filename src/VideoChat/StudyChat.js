
import React, { useCallback, useEffect, useRef, useState } from "react";

import ChatList from "./ChatList";
import CreateChat from "./CreateChat";

import tw from 'twin.macro';
import styled from '@emotion/styled';
import { conn, stompconn } from "../App";
import Cookies from 'universal-cookie';
import Timer from './Timer';

import { faCamera, faMicrophone, faMicrophoneAltSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import getuser from '../Api/getuser';
import peopledefault from '../assets/images/peopledefault.png';
import { useParams } from "react-router";

import getRemainTime from "../Api/getRemainTime";
import getDetailTopics from "../Api/getDetailTopics";
import AudioRecord from "./AudioRecord";
import ProgressBar from "./ProgressBar";
import axios from "axios";




const ProgressBarWrapper = styled.div`
    font-family: 'NanumGothic-Bold';
    ${tw`pt-10`}
`;

const ChatView = styled.div`
    font-family: 'NanumGothic-Regular';
    background: #262624;
    border: 2px solid #262626;


    ${tw`border h-80vh w-35vh rounded-lg mx-10 flex flex-col justify-between`}
`;

const VideoWrapper = styled.div`
    font-family: 'NanumGothic-Regular';
    background: #0D0D0E;
    ${tw`text-center max-w-full h-100vh`}
`;

const UserVideo = styled.video`
    background: #0D0D0E;
    background-image: url(${peopledefault});
    color: #25292E;
    border: 2px solid #262626;
    background-size: 20%;
    background-repeat: no-repeat;
    background-position: center;


    ${tw` w-75vh h-35vh mb-3 rounded-lg`}
`;


const ToggleButton = styled.div`   
    background: #262626;
    &:hover {
        color: 	#4B7DDA;
        border: 1px solid
    }
    ${tw`border p-1 rounded border-gray-400 text-gray-200  w-1/6 mb-10 cursor-pointer`}
`;

const VideoUserText = styled.text`

    ${tw`text-gray-100 font-semibold p-2 `}
`;

const ChatLabelText = styled.text`
    ${tw`text-gray-100 font-semibold mx-10 p-2 `}
`;


const StudyExitButton = styled.div`

    ${tw`mt-10 mr-10 flex-row cursor-pointer rounded-lg w-1/12  font-semibold text-white bg-red-600 p-2`}
`;

function StudyChat() {
    let localStream;
    let myPeerConnection;
    const cookies = new Cookies();
    const token = cookies.get('vtoken');
    const localUserName = localStorage.getItem("uuid")
    const myVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const chatRef = useRef(null)
    const [isLoaded, setIsLoaded] = useState(false);
    const [localVideoState, SetLocalVideoState] = useState(true);
    const [localAudioState, SetLocalAudioState] = useState(true);
    const [myId, setMyId] = useState("");
    const [detailTopicList, setDetailTopicList] = useState();

    const { localRoom } = useParams();


    const audioRecordRef = useRef();
    const [step, setStep] = useState(0);
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
        // {
        //     id: 1,
        //     sender: 'test_sender',
        //     message: '테스트용 메세지 입니다.'
        // }
    ]);
    const nextChatId = useRef(3)

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
        stompconn.connect({ Authorization: token }, function (frame) {
            console.log('Websocket connection complete.');
            videoSubscribe();
            chatSubscribe();
            chatUserSubscribe();
            stompconn.send('/pub/videochat/enter', { Authorization: token }, JSON.stringify({ matchId: localRoom }));
        });

    }

    const videoSubscribe = () => {
        stompconn.subscribe('/sub/video-signal/' + localUserName, function (frame) {
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



    const chatOnCreate = useCallback(() => {
        // 채팅 보내는 부분

        stompconn.send('/pub/videochat/message', { Authorization: token }, JSON.stringify({ matchId: localRoom, message: message, matchUserId: myId }));
        // setChats(chats => chats.concat(chat));

        setChatInputs({
            message: ''
        })
    }, [message]);


    const chatSubscribe = () => {
        stompconn.subscribe('/sub/videochat/' + localRoom, function (message) {
            var content = JSON.parse(message.body);
            console.log('chat subscribe');

            const chat = {
                id: nextChatId.current,
                message: content.message,
                sender: content.senderName,
                userId: content.matchUserId
            }
            console.log(content)
            setChats(chats => chats.concat(chat))
            nextChatId.current += 1;
        });
    }

    const chatUserSubscribe = () => {
        stompconn.subscribe('/user/sub/videochat/' + localRoom, function (message) {
            var content = JSON.parse(message.body);
            console.log("개인 메세지", content.matchUserId);
            setMyId(content.matchUserId);
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


    function log(message) {
        console.log(message);
    }

    function handleErrorMessage(message) {
        console.error(message);
    }

    // use JSON format to send WebSocket message
    function sendToServer(msg) {
        let msgJSON = JSON.stringify(msg);

        stompconn.send("/pub/video-signal", { Authorization: token }, msgJSON);

    }

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
        if (remoteVideoRef) {
            remoteVideoRef.current.srcObject = null;
        }
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
            myVideoRef.current.muted = true;
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


    // const getUserMediaReact = async () => {
    //     try {
    //         console.log('get my video .');
    //         localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    //         myVideoRef.current.srcObject = localStream;
    //         myVideoRef.current.muted = true;
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };


    const [user, setUser] = useState(null);

    useEffect(() => {
        if (!user) {
            getuser()
                .then((res) => {
                    console.log(res);
                    setUser(res);
                    axios.get('/matching/participant-check/' + localRoom + '/' + res.id)
                        .then(
                            res => {
                                if (!res.data.result) {
                                    alert('정해진 참가자가 아니에요.');
                                    window.location.href = '/';
                                }
                            }
                        )

                })
                .catch((err) => {
                    alert("로그인 세션이 만료되었어요.");
                    window.location.href = "/logout"
                })


        }

        getRemainTime(cookies.get("vtoken"), localRoom)
            .then((remainTime => {
                let topics = "";
                getDetailTopics(cookies.get("vtoken"), localRoom)
                .then((detailTopics => {
                    console.log(detailTopics);
                    topics += detailTopics[0].context + '\n' + detailTopics[1].context;
                }))
                if (remainTime >= 0) {
                    setTimeout(() => {
                        setStep(1);
                        console.log("시작 직후 뒤 실행되는 부분")
                    }, remainTime);
                }
                // 시작시각 + 3분 후
                if (remainTime + 2000 >= 0) {
                    setTimeout(() => {
                        setStep(2);
                        console.log("3분 뒤 실행되는 부분", detailTopicList)
                        var message = "지금부터 한국어 세션이 시작합니다.\n아래 토픽에 대해 한국어로 대화해주세요.\nThe Korean session starts now.\nPlease talk about the topic below in Korean.\n\n";
                        message += topics;
                        //audioRecordRef.current.onRecAudio(localVideoState);
                        const notice = {
                            id: nextChatId.current,
                            message: message,
                            sender: 'Verpic',
                            userId: 0
                        }
                        setChats(chats => chats.concat(notice));
                        nextChatId.current += 1;
                    }, remainTime + 5000);
                }
                // 시작시각 + 10분 후
                if (remainTime + 2000 >= 0) {
                    setTimeout(() => {
                        setStep(3);
                        var message = "지금부터 영어 세션이 시작합니다.\n아래 토픽에 대해 영어로 대화해주세요.\nThe English session starts now.\nPlease talk about the topic below in English.\n\n";
                        message += topics;
                        console.log("10분 뒤 실행되는 부분")
                        const notice = {
                            id: nextChatId.current,
                            message: message,
                            sender: 'Verpic',
                            userId: 0
                        }
                        setChats(chats => chats.concat(notice));
                        nextChatId.current += 1;
                        //audioRecordRef.current.offRecAudio(1, "ko");
                        //audioRecordRef.current.onRecAudio(localVideoState);
                    }, remainTime + 10000);
                }
                // 시작시각 + 17분 후
                if (remainTime + 2000 >= 0) {
                    setTimeout(() => {
                        setStep(4);
                        console.log("17분 뒤 실행되는 부분")
                        var message = "곧 세션이 마감됩니다. 마무리 인사를 해주세요.\nThe session will be closed soon.\nPlease say goodbye to your partner."
                        //audioRecordRef.current.offRecAudio(2, "en");
                        const notice = {
                            id: nextChatId.current,
                            message: message,
                            sender: 'Verpic',
                            userId: 0
                        }
                        setChats(chats => chats.concat(notice));
                        nextChatId.current += 1;
                    }, remainTime + 18000);
                }
                setIsLoaded(true);

            }))
            .catch((err) => {
                console.log("에러발생", err);
            })
        stompWithSockJS();
        //getUserMediaReact();
    }, []);
    
        useEffect(() => {
            console.log(detailTopicList)
            }, [detailTopicList]);


    const videoButtonOff = () => {
        myVideoRef.current.srcObject.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
            SetLocalVideoState(!localVideoState)
        })
    }
    const micButtonOff = () => {
        myVideoRef.current.srcObject.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
            SetLocalAudioState(!localAudioState)
        })
        audioRecordRef.current.micButtonOff();
    }

    return (

        <VideoWrapper>
            {!isLoaded ? <div class="text-center">로딩중이에요...</div> :
                <div>
                    <ProgressBarWrapper>
                        <ProgressBar step={step}></ProgressBar>
                    </ProgressBarWrapper>

                    {/* <Timer></Timer> */}

                    <div class="container flex mt-5 justify-between mx-auto">
                        <div class="flex-col">


                            <div class="">
                                <div class="text-left">
                                    <VideoUserText>{user.firstName}{user.lastName}의 비디오</VideoUserText>
                                </div>
                                <UserVideo autoPlay playsInline ref={myVideoRef} />


                                <div class="flex justify-between">
                                    <ToggleButton onClick={videoButtonOff}>{localVideoState ?
                                        <FontAwesomeIcon icon={faCamera} />

                                        : <FontAwesomeIcon icon={faCamera} />}
                                    </ToggleButton>
                                    <ToggleButton onClick={micButtonOff}>{localAudioState ?
                                        <FontAwesomeIcon icon={faMicrophone} />

                                        : <FontAwesomeIcon icon={faMicrophoneAltSlash} />}
                                    </ToggleButton>
                                </div>
                                <div class="text-left">
                                    <VideoUserText>상대방의 비디오</VideoUserText>
                                    <UserVideo autoPlay playsInline ref={remoteVideoRef} />
                                </div>
                            </div>
                        </div>
                        <div class="flex-col">
                            <div class="text-left">
                                <ChatLabelText>채팅</ChatLabelText>
                            </div>

                            <ChatView ref={chatRef}>
                                <ChatList chats={chats} myId={myId} />
                                <CreateChat
                                    message={message}
                                    onChange={chatOnChange}
                                    onCreate={chatOnCreate}
                                ></CreateChat>
                            </ChatView>
                        </div>

                    </div>
                    {/* 여기 matchId 들어가야함! */}
                    <AudioRecord matchId={localRoom} ref={audioRecordRef}></AudioRecord>
                    <div class="flex justify-end">
                        <StudyExitButton onClick={() => window.close()}>학습 종료</StudyExitButton>
                    </div>
                </ div>}
        </VideoWrapper >





    );

}

export default React.memo(StudyChat);