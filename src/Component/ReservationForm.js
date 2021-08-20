import React, { useState, useRef } from 'react';
import Cookies from 'universal-cookie';
import Modal from 'styled-react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import tw from "twin.macro";

const ReservationWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container ml-20  mr-10 mb-10`}
`;

const ReservationQuestionWrapper = styled.div`
  ${tw`border rounded shadow-lg p-10`}
`;

const ResevationText = styled.div`
  ${tw`text-3xl font-bold mb-1 select-none`}
`;

const ReservationOptionText = styled.div`
  ${tw`font-semibold text-xl `}
`;
const ReservationOptionWrapper = styled.div`
  ${tw`mx-auto mb-10`}
`;

const ReservationOptionSelect = styled.select`
  ${tw`ml-10 border p-3 rounded mt-4`}
`;

const ReservationSendButton = styled.button`
  ${tw`border w-full rounded-lg p-3  text-white font-bold`}
`;

const StyledModal = Modal.styled`
    font-family: "NanumGothic-Regular";
    width: 500px;
    height: 300px;
    ${tw`bg-gray-100 rounded-lg `}
`;

const ModalButton = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`p-2 border w-1/2 mx-auto mt-20 bg-yellow-400 text-white rounded-lg text-center cursor-pointer`}
`;

function ReservationForm({ topicId }) {
    const [Mothertongue, SetMothertongue] = useState("");
    const [Studylanguage, SetStudylanguage] = useState("");
    const [Proficiency, SetProficiency] = useState("");
    const [Studytime, SetStudytime] = useState("");
    const cookies = new Cookies();
    const token = cookies.get('vtoken');
    const modalRef = useRef();

    const [isOpen, setIsOpen] = useState(false)
    const [modalContent, setModalContent] = useState();

    function toggleModal(e) {
        setIsOpen(!isOpen)
    }

    const mothertongueHandler = (e) => {
        e.preventDefault();
        SetMothertongue(e.target.value);
    };

    const studylanguageHandler = (e) => {
        e.preventDefault();
        SetStudylanguage(e.target.value);
    };

    const proficiencyHandler = (e) => {
        e.preventDefault();
        SetProficiency(e.target.value);
    };

    const studytimeHandler = (e) => {
        e.preventDefault();
        SetStudytime(e.target.value);
    };


    const allAnswerFulfiled = () => {
        if (Mothertongue && Studylanguage && Proficiency && Studytime && topicId)
            return false;
        else
            return true;
    }

    const submitHandler = (e) => {
        e.preventDefault();

        // state에 저장한 값을 가져옵니다.
        console.log(Mothertongue);
        console.log(Studylanguage);
        console.log(Proficiency);
        console.log(Studytime);

        if (Mothertongue === Studylanguage) {
            setModalContent("모국어와 공부할 언어는 달라야 해요.")
            setIsOpen(!isOpen);
            return;
        }

        let body = {
            familiarLanguage: Mothertongue,
            unfamiliarLanguage: Studylanguage,
            userLevel: Proficiency,
            topicId: topicId,
            startTime: Studytime,
            isSoldOut: false
        };

        axios
            .post("/reservation/", body, {
                headers: {
                    'Authorization': token
                }
            })
            .then((res) => {
                console.log(res);
                setModalContent("스터디 예약을 완료했어요.")
                setIsOpen(!isOpen);


            })
            .catch((err) => {
                if (err.response) {
                    const statusCode = err.response.data.httpStatus;
                    if (statusCode === "UNAUTHORIZED") {
                        setModalContent("중복된 토픽과 시간대에 이미 예약을 했어요.")
                        setIsOpen(!isOpen);
                    }
                    else {
                        setModalContent("로그인 세션이 만료되었어요.")
                        setIsOpen(!isOpen);
                        window.location.href = "/logout"
                    }

                }
                console.log(err.response);
                //
            });



    };

    return (

        <ReservationWrapper>
            <ResevationText>스터디 신청</ResevationText>


            <div className="text-gray-600 mb-3 select-none">간단한 답변만 해주시면 돼요.</div>

            <ReservationQuestionWrapper>
                <ReservationOptionWrapper>

                    <ReservationOptionText className="mb-10">
                        <div className="flex">
                            <span className="mr-3">
                                Step1. 원하는 토픽을 먼저 골라주세요.
                            </span>
                            <span>
                                {topicId ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>
                    </ReservationOptionText>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step2. 모국어를 선택해주세요.</span>
                            <span>
                                {Mothertongue ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>

                    </ReservationOptionText>
                    <ReservationOptionSelect name="mothertongue" value={Mothertongue} onChange={mothertongueHandler}>
                        <option value="">선택</option>
                        <option value="KOR">korean</option>
                        <option value="ENG">english</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <ReservationOptionWrapper>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step3. 어떤 언어를 공부하실건가요?</span>
                            <span>
                                {Studylanguage ?
                                    <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>
                    </ReservationOptionText>
                    <ReservationOptionSelect name="studylanguage" value={Studylanguage} onChange={studylanguageHandler}>
                        <option value="">선택</option>
                        <option value="KOR">korean</option>
                        <option value="ENG">english</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <ReservationOptionWrapper>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step4. 배울 언어의 수준을 말해주세요.</span>
                            <span>
                                {Proficiency ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>

                        </div>
                    </ReservationOptionText>
                    <ReservationOptionSelect name="proficiency" value={Proficiency} onChange={proficiencyHandler}>
                        <option value="">선택</option>
                        <option value="BEGINNER">beginner</option>
                        <option value="INTERMEDIATE">intermediate</option>
                        <option value="ADVANCED">advanced</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <ReservationOptionWrapper>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step5. 어떤 시간대에 참여하실래요?</span>
                            <span>
                                {Studytime ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>
                    </ReservationOptionText>
                    <ReservationOptionSelect name="studytime" value={Studytime} onChange={studytimeHandler}>
                        <option value="">선택</option>
                        <option value="17">17시</option>
                        <option value="18">18시</option>
                        <option value="19">19시</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <StyledModal
                    isOpen={isOpen}
                    onBackgroundClick={toggleModal}
                    onEscapeKeydown={toggleModal}
                >

                    <div className="text-center mt-28 text-xl" ref={modalRef}>{modalContent}</div>
                    <div className="text-align">
                        <ModalButton onClick={toggleModal}>확인</ModalButton>
                    </div>
                </StyledModal>


                <ReservationSendButton disabled={allAnswerFulfiled()} className={allAnswerFulfiled() ? "bg-gray-400 cursor-default" : "bg-yellow-400"} onClick={submitHandler}>
                    {allAnswerFulfiled() ? "모든 답변을 완료해주세요." : "스터디 신청"}
                </ReservationSendButton>

            </ReservationQuestionWrapper>
        </ReservationWrapper>

    );
}

export default React.memo(ReservationForm);
