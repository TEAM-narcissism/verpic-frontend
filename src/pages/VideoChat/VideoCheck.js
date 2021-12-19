import styled from "@emotion/styled";
import tw from 'twin.macro';
import peopledefault from "assets/images/peopledefault.png";
import {useRef, useEffect, useState} from 'react';
import { ModalProvider } from "styled-react-modal";
import {StyledModal} from 'pages/Reservation/ReservationForm';
import {ModalButton} from 'pages/Reservation/ReservationForm';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faSlash, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router";

const VideoCheckWrapper = styled.div`

    font-family: 'NanumGothic-Regular';

    ${tw`pt-10 h-200vh bg-gray-100 text-black max-w-full`}
`;


const VideoWrapper = styled.div`

    ${tw` bg-gray-100 w-40vw mx-auto  h-50vh  `}
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
  -webkit-transform:rotateY(180deg);    
  -moz-transform:rotateY(180deg);

  ${tw`w-full h-40vh mb-3 rounded-lg shadow-lg`}
`;

const StatusCheckMessage = styled.div`
${tw`text-2xl mb-1 font-semibold`}
`;

const StudyRoomButton = styled.div`
  background: ${props => !props.condition ? '#808080' : '#140DF0'};
  ${tw`w-1/4 border rounded-lg p-2  cursor-pointer text-white text-center align-middle font-semibold`}
`;  

function VideoCheck() {
  const { t, i18n } = useTranslation('reservationform');
  const modalRef = useRef();
  const [camera, setCamera] = useState(false);
  const [mic, setMic] = useState(false);
 const [isOpen, setIsOpen] = useState(false)
  const [modalContent, setModalContent] = useState();
  const [condition, setCondition] = useState(false);
  const [entranceText, setEntranceText] = useState("입장불가");
  const {matchId} = useParams();
  const videoRef = useRef();

  function toggleModal(e) {
      setIsOpen(!isOpen)
  }

    const getMedia = async () => {

        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({audio:false, video:true});
          videoRef.current.srcObject = videoStream;
  
          videoStream.getTracks().forEach((track)=> {
            if(track.kind === "video") {
              setCamera(true);
            }}
          );

          const audioStream = await navigator.mediaDevices.getUserMedia({audio:true, video:false});
          audioStream.getTracks().forEach((track)=> {
          if(track.kind === "audio") {
              setMic(true);
            }}
          );

          setEntranceText("입장하기");
          setCondition(true);

        } catch (err) {
          console.error(err);
          if(!mic) {
            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({audio:true, video:false});
                audioStream.getTracks().forEach((track)=> {
                if(track.kind === "audio") {
                    setMic(true);
                  }}
                );
            }
            catch(err) {
              
              setModalContent("카메라와 마이크가 모두 연결되어야 해요.");
              setIsOpen(true);
            }

          } else {
            setModalContent("카메라와 마이크가 모두 연결되어야 해요.");
            setIsOpen(true);
          }
        }
 
      };


    


    return (
        <VideoCheckWrapper>
           <ModalProvider>
            <VideoWrapper>
            <StatusCheckMessage>테스트 페이지</StatusCheckMessage>
            <div class="text-gray-700 mb-1">회원님의 마이크와 카메라 연결 상태를 확인해주세요.</div>

            <UserVideo autoPlay playsInline ref={videoRef}>

            </UserVideo>
            <div className="flex justify-between mb-5">
              <StudyRoomButton onClick={()=> getMedia()}>테스트 시작</StudyRoomButton>

    

              <StudyRoomButton condition={condition} onClick={condition ? ()=> {window.location.href="/studychat/" + matchId} : null}>{entranceText}</StudyRoomButton>
            </div>

            <div className="flex-col border p-2 border-black text-center rounded-lg">
              <div>
              카메라 작동 여부 {camera ?  <FontAwesomeIcon className="text-green-500" icon={faCheckCircle}></FontAwesomeIcon> : <FontAwesomeIcon className="text-red-600" icon={faTimesCircle}></FontAwesomeIcon> }
              </div>
              <div>
              오디오 작동 여부 {mic ?  <FontAwesomeIcon className="text-green-500" icon={faCheckCircle}></FontAwesomeIcon> : <FontAwesomeIcon className="text-red-600" icon={faTimesCircle}></FontAwesomeIcon> }
              </div>
            </div>

            <li class="text-gray-700 mb-1 text-center mt-5"> 현재 얼굴과 목소리는 상대방에게 전달되지 않아요.</li>
            <li class="text-gray-700 mb-1 text-center"> 비디오와 마이크가 모두 작동됨을 확인해야 스터디룸에 참여할 수 있어요.</li>
            <li class="text-gray-700 mb-1 text-center">버픽의 스터디룸은 Chrome 브라우저 환경에 최적화 되어 있어요.</li>
            <li class="text-gray-700 mb-1 text-center">한국어 세션과 영어 세션에 대한 답변을 바탕으로 피드백이 진행됩니다.</li>

            <StyledModal
                    isOpen={isOpen}
                    onBackgroundClick={toggleModal}
                    onEscapeKeydown={toggleModal}
                >

                    <div className="text-center mt-28 text-xl" ref={modalRef}>{modalContent}</div>
                    <div className="text-align">
                        <ModalButton onClick={toggleModal}>{t('modalbutton')}</ModalButton>
                    </div>
                </StyledModal>

        

            </VideoWrapper>

            </ModalProvider>
        </VideoCheckWrapper>


    );



}

export default VideoCheck;
