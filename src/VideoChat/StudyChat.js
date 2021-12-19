import React, { useCallback, useEffect, useRef, useState } from "react";
import { conn, stompconn } from "../App";
import {
  faMicrophone,
  faMicrophoneSlash,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";

import AudioRecord from "./AudioRecord";
import ChatList from "./ChatList";
import Cookies from "universal-cookie";
import CreateChat from "./CreateChat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalButton } from "Reservation/ReservationForm";
import { ModalProvider } from "styled-react-modal";
import ProgressBar from "./ProgressBar";
import { StyledModal } from "Reservation/ReservationForm";
import axios from "axios";
import getDetailTopics from "api/getDetailTopics";
import getRemainTime from "api/getRemainTime";
import getuser from "api/getuser";
import peopledefault from "assets/images/peopledefault.png";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

const ProgressBarWrapper = styled.div`
  font-family: "NanumGothic-Bold";
  ${tw`pt-3`}
`;

const ChatView = styled.div`
  font-family: "NanumGothic-Regular";
  background: #262624;
  border: 2px solid #262626;

  ${tw`border h-80vh w-30vw rounded-lg mx-10 text-black flex flex-col justify-between`}
`;

const VideoWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  background: #0d0d0e;
  ${tw`text-center max-w-full h-120vh`}
`;

const UserVideo = styled.video`
  background: #0d0d0e;
  background-image: url(${peopledefault});
  color: #25292e;
  border: 2px solid #262626;
  background-size: 20%;
  background-repeat: no-repeat;
  background-position: center;
  transform: rotateY(180deg);
  -webkit-transform: rotateY(180deg);
  -moz-transform: rotateY(180deg);

  ${tw` w-75vw h-35vh mb-3 rounded-lg`}
`;

const ToggleButton = styled.div`
  background: #262626;
  &:hover {
    color: #4b7dda;
    border: 1px solid;
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
  const token = cookies.get("vtoken");
  const localUserName = localStorage.getItem("uuid");
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [localVideoState, SetLocalVideoState] = useState(true);
  const [localAudioState, SetLocalAudioState] = useState(true);
  const [myId, setMyId] = useState("");
  const { localRoom } = useParams();
  const adminName = "Verpic";
  const { t, i18n } = useTranslation("reservationform");
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState();

  function toggleModal(e) {
    setIsOpen(!isOpen);

    if (
      modalContent ===
      "카메라와 마이크 모두 연결되어야 해요. 테스트 페이지에서 다시 확인 부탁드려요."
    ) {
      window.location.href = "/videochecking";
    }
  }

  const audioRecordRef = useRef();
  const [step, setStep] = useState(0);
  const [chatInputs, setChatInputs] = useState({
    message: "",
    sender: "testsss",
  });

  const { message, sender } = chatInputs;

  const chatOnChange = useCallback((e) => {
    const { name, value } = e.target;
    setChatInputs((chatInputs) => ({
      ...chatInputs,
      [name]: value,
    }));
  }, []);

  const [chats, setChats] = useState([]);
  const nextChatId = useRef(1);

  const addChat = (message, sender, userId) => {
    const chat = {
      id: nextChatId.current,
      message: message,
      sender: sender,
      userId: userId,
    };
    setChats((chats) => chats.concat(chat));
    nextChatId.current += 1;
  };

  const peerConnectionConfig = {
    iceServers: [
      { urls: "stun:stun.stunprotocol.org:3478" },
      { urls: "stun:stun.l.google.com:19302" },
    ],
  };

  const mediaConstraints = {
    audio: true,
    video: true,
  };

  function stompWithSockJS() {
    stompconn.connect({ Authorization: token }, function (frame) {
      console.log("Websocket connection complete.");
      videoSubscribe();
      chatSubscribe();
      chatUserSubscribe();
      stompconn.send(
        "/pub/videochat/enter",
        { Authorization: token },
        JSON.stringify({ matchId: localRoom })
      );
    });
  }

  const videoSubscribe = () => {
    stompconn.subscribe("/sub/video-signal/" + localUserName, function (frame) {
      let message = JSON.parse(frame.body);
      switch (message.type) {
        case "text":
          console.log(
            "Text message from " + message.from + " received: " + message.data
          );
          break;

        case "offer":
          console.log("Signal OFFER received");
          handleOfferMessage(message);
          break;

        case "answer":
          console.log("Signal ANSWER received");
          handleAnswerMessage(message);
          break;

        case "ice":
          console.log("Signal ICE Candidate received");
          handleNewICECandidateMessage(message);
          break;

        case "join":
          console.log(
            "Client is starting to " +
              (message.data === "true" ? "negotiate" : "wait for a peer")
          );
          handlePeerConnection(message);
          break;

        default:
          handleErrorMessage("Wrong type message received from server");
      }
    });

    sendToServer({
      from: localUserName,
      type: "join",
      data: localRoom,
    });

    stompconn.onclose = function (frame) {
      log("Socket has been closed");
    };

    stompconn.onerror = function (frame) {
      handleErrorMessage("Error: " + frame);
    };
  };

  const chatOnCreate = useCallback(() => {
    // 채팅 보내는 부분

    stompconn.send(
      "/pub/videochat/message",
      { Authorization: token },
      JSON.stringify({
        matchId: localRoom,
        message: message,
        matchUserId: myId,
      })
    );
    // setChats(chats => chats.concat(chat));

    setChatInputs({
      message: "",
    });
  }, [message]);

  const chatSubscribe = () => {
    stompconn.subscribe("/sub/videochat/" + localRoom, function (message) {
      var content = JSON.parse(message.body);
      addChat(content.message, content.senderName, content.matchUserId);
      console.log(content);
    });
  };

  const chatUserSubscribe = () => {
    stompconn.subscribe("/user/sub/videochat/" + localRoom, function (message) {
      var content = JSON.parse(message.body);
      setMyId(content.matchUserId);
    });
  };

  function stop() {
    // send a message to the server to remove this client from the room clients list

    log("Send 'leave' message to server");
    sendToServer({
      from: localUserName,
      type: "leave",
      data: localRoom,
    });

    if (myPeerConnection) {
      log("Close the RTCPeerConnection");

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
        remoteVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }

      remoteVideoRef.current.src = null;

      if (myVideoRef.current.srcObject) {
        myVideoRef.current.srcObject
          .getTracks()
          .forEach((track) => track.stop());
      }
      myVideoRef.current.src = null;

      myPeerConnection.close();
      myPeerConnection = null;

      log("Close the socket");
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
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    await navigator.mediaDevices
      .getUserMedia(constraints)
      .then(getLocalMediaStream)
      .catch((err) => {
        setModalContent(
          "카메라와 마이크 모두 연결되어야 해요. 테스트 페이지에서 다시 확인 부탁드려요."
        );
        setIsOpen(true);
        stop();
      });
  };

  // create peer connection, get media, start negotiating when second participant appears
  function handlePeerConnection(message) {
    if (remoteVideoRef.current) {
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

    myPeerConnection.onicecandidate = handleICECandidateEvent;
    myPeerConnection.ontrack = handleTrackEvent;
  }

  function getLocalMediaStream(mediaStream) {
    localStream = mediaStream;
    if (myVideoRef.current) {
      myVideoRef.current.srcObject = mediaStream;
      myVideoRef.current.muted = true;
    }

    console.log("localStream:", localStream);
    localStream.getTracks().forEach((track) => {
      myPeerConnection.addTrack(track, localStream);
    });
  }

  function handleICECandidateEvent(event) {
    if (event.candidate) {
      sendToServer({
        from: localUserName,
        type: "ice",
        candidate: event.candidate,
      });
      log("ICE Candidate Event: ICE candidate sent");
    }
  }

  function handleTrackEvent(event) {
    log("Track Event: set stream to remote video element");

    remoteVideoRef.current.srcObject = event.streams[0];
  }

  function handleNegotiationNeededEvent() {
    myPeerConnection
      .createOffer()
      .then(function (offer) {
        return myPeerConnection.setLocalDescription(offer);
      })
      .then(function () {
        sendToServer({
          from: localUserName,
          type: "offer",
          sdp: myPeerConnection.localDescription,
        });
        log("Negotiation Needed Event: SDP offer sent");
      })
      .catch(function (reason) {
        handleErrorMessage("failure to connect error: ", reason);
      });
  }

  function handleOfferMessage(message) {
    log("Accepting Offer Message");
    log(message);
    let desc = new RTCSessionDescription(message.sdp);
    //TODO test this
    if (desc != null && message.sdp != null) {
      log("RTC Signalling state: " + myPeerConnection.signalingState);
      myPeerConnection
        .setRemoteDescription(desc)
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
            type: "answer",
            sdp: myPeerConnection.localDescription,
          });
        })
        .catch(handleErrorMessage);
    }
  }

  function handleAnswerMessage(message) {
    log("The peer has accepted request");
    myPeerConnection
      .setRemoteDescription(message.sdp)
      .catch(handleErrorMessage);
  }

  function handleNewICECandidateMessage(message) {
    let candidate = new RTCIceCandidate(message.candidate);
    log("Adding received ICE candidate: " + JSON.stringify(candidate));
    myPeerConnection.addIceCandidate(candidate).catch(handleErrorMessage);
  }

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!user) {
      getuser().then((res) => {
        console.log(res);
        setUser(res);
        axios
          .get("/api/matching/participant-check/" + localRoom + "/" + res.id)
          .then((res) => {
            if (!res.data.result) {
              alert("정해진 참가자가 아니에요.");
              window.location.href = "/";
            }
          });
      });
    }

    getRemainTime(cookies.get("vtoken"), localRoom)
      .then((remainTime) => {
        let topics = "";
        getDetailTopics(cookies.get("vtoken"), localRoom).then(
          (detailTopics) => {
            topics += detailTopics[0].context + "\n" + detailTopics[1].context;
          }
        );
        if (remainTime >= 0) {
          setTimeout(() => {
            setStep(1);
            console.log("시작 직후 뒤 실행되는 부분");
          }, remainTime);
        }
        // 시작시각 + 3분 후
        if (remainTime + 180000 >= 0) {
          setTimeout(() => {
            setStep(2);
            console.log("3분 뒤 실행되는 부분");
            var message =
              "지금부터 한국어 세션이 시작합니다.\n아래 토픽에 대해 한국어로 대화해주세요.\nThe Korean session starts now.\nPlease talk about the topic below in Korean.";
            addChat(message, adminName, 0);
            message = topics;
            addChat(message, adminName, 0);

            audioRecordRef.current.onRecAudio(localVideoState);
          }, remainTime + 180000);
        }
        // 시작시각 + 10분 후
        if (remainTime + 600000 >= 0) {
          setTimeout(() => {
            setStep(3);
            var message =
              "지금부터 영어 세션이 시작합니다.\n아래 토픽에 대해 영어로 대화해주세요.\nThe English session starts now.\nPlease talk about the topic below in English.\n\n";
            addChat(message, adminName, 0);
            message = topics;
            addChat(message, adminName, 0);

            console.log("10분 뒤 실행되는 부분");
            audioRecordRef.current.offRecAudio(1, "ko");
            audioRecordRef.current.onRecAudio(localVideoState);
          }, remainTime + 600000);
        }
        // 시작시각 + 17분 후
        if (remainTime + 1020000 >= 0) {
          setTimeout(() => {
            setStep(4);
            console.log("17분 뒤 실행되는 부분");
            audioRecordRef.current.offRecAudio(2, "en");
            var message =
              "곧 세션이 마감됩니다. 마무리 인사를 해주세요.\nThe session will be closed soon.\nPlease say goodbye to your partner.";
            addChat(message, adminName, 0);
          }, remainTime + 1020000);
        }
        setIsLoaded(true);
      })
      .catch((err) => {
        console.log("에러발생", err);
      });
    stompWithSockJS();
    //getUserMediaReact();
  }, []);

  const videoButtonOff = () => {
    myVideoRef.current.srcObject.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
      SetLocalVideoState(!localVideoState);
    });
  };
  const micButtonOff = () => {
    myVideoRef.current.srcObject.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
      SetLocalAudioState(!localAudioState);
    });
    audioRecordRef.current.micButtonOff();
  };

  return (
    <ModalProvider>
      <VideoWrapper>
        {!isLoaded ? (
          <div class="flex btn btn-lg btn-ghost text-white loading mx-auto">
            {t("isloading")}
          </div>
        ) : (
          <div>
            <ProgressBarWrapper>
              <ProgressBar step={step}></ProgressBar>
            </ProgressBarWrapper>

            {/* <Timer></Timer> */}

            <div class="container flex mt-5 justify-between mx-auto">
              <div class="flex-col">
                <div class="">
                  <div class="text-left">
                    <VideoUserText>상대방의 비디오</VideoUserText>
                    <UserVideo autoPlay playsInline ref={remoteVideoRef} />
                  </div>

                  <div class="text-left">
                    <VideoUserText>
                      {user.firstName}
                      {user.lastName}의 비디오
                    </VideoUserText>
                  </div>
                  <UserVideo autoPlay playsInline ref={myVideoRef} />

                  <div class="flex justify-between">
                    <ToggleButton onClick={videoButtonOff}>
                      {localVideoState ? (
                        <FontAwesomeIcon icon={faVideo} />
                      ) : (
                        <FontAwesomeIcon icon={faVideoSlash} />
                      )}
                    </ToggleButton>
                    <ToggleButton onClick={micButtonOff}>
                      {localAudioState ? (
                        <FontAwesomeIcon icon={faMicrophone} />
                      ) : (
                        <FontAwesomeIcon icon={faMicrophoneSlash} />
                      )}
                    </ToggleButton>
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
              <StudyExitButton onClick={() => window.close()}>
                학습 종료
              </StudyExitButton>
            </div>
          </div>
        )}
      </VideoWrapper>

      <StyledModal
        isOpen={isOpen}
        onBackgroundClick={toggleModal}
        onEscapeKeydown={toggleModal}
      >
        <div className="text-center mt-28 text-xl">{modalContent}</div>
        <div className="text-align">
          <ModalButton onClick={toggleModal}>{t("modalbutton")}</ModalButton>
        </div>
      </StyledModal>
    </ModalProvider>
  );
}

export default React.memo(StudyChat);
