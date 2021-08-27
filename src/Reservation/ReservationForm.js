import React, { useState, useRef } from 'react';
import Cookies from 'universal-cookie';
import Modal from 'styled-react-modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useTranslation } from 'react-i18next';

const ReservationWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container w-1/2 ml-20 mb-10 `}
`;

const ReservationQuestionWrapper = styled.div`
  ${tw`border-2 rounded-lg shadow-lg p-10 bg-white`}
`;

const ResevationText = styled.div`
  ${tw`text-3xl text-black font-bold mb-1 select-none`}
`;

const ReservationOptionText = styled.div`
  ${tw`font-semibold text-black text-xl `}
`;
const ReservationOptionWrapper = styled.div`
  ${tw`mx-auto mb-10 text-black`}
`;

const ReservationOptionSelect = styled.select`
  ${tw`ml-10 border p-3 rounded mt-4 `}
`;

const ReservationSendButton = styled.button`
  ${tw`border w-full rounded-lg p-3  text-white font-semibold`}
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
    const { t, i18n } = useTranslation('reservationform');

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
            setModalContent(t('alert.notproperlanguage'))
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
                setModalContent(t('alert.reservationcomplete'))
                setIsOpen(!isOpen);


            })
            .catch((err) => {
                if (err.response) {
                    const statusCode = err.response.data.httpStatus;
                    if (statusCode === "UNAUTHORIZED") {
                        setModalContent(t('alert.redundantreservation'))
                        setIsOpen(!isOpen);
                    }
                    else {
                        setModalContent(t('alert.sessionexpired'))
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
            <ResevationText>{t('reservationtext')}</ResevationText>


            <div className="text-gray-600 mb-3 select-none">{t('explanation')}</div>

            <ReservationQuestionWrapper>
                <ReservationOptionWrapper>

                    <ReservationOptionText className="mb-10">
                        <div className="flex">
                            <span className="mr-3">
                                Step1. {t('step1')}
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
                            <span className="mr-3">Step2. {t('step2')}</span>
                            <span>
                                {Mothertongue ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>

                    </ReservationOptionText>
                    <ReservationOptionSelect name="mothertongue" value={Mothertongue} onChange={mothertongueHandler}>
                        <option value="">{t('languageselection.selection')}</option>
                        <option value="KOR">{t('languageselection.kor')}</option>
                        <option value="ENG">{t('languageselection.eng')}</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <ReservationOptionWrapper>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step3. {t('step3')}</span>
                            <span>
                                {Studylanguage ?
                                    <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>
                    </ReservationOptionText>
                    <ReservationOptionSelect name="studylanguage" value={Studylanguage} onChange={studylanguageHandler}>
                        <option value="">{t('languageselection.selection')}</option>
                        <option value="KOR">{t('languageselection.kor')}</option>
                        <option value="ENG">{t('languageselection.eng')}</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <ReservationOptionWrapper>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step4. {t('step4')}</span>
                            <span>
                                {Proficiency ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>

                        </div>
                    </ReservationOptionText>
                    <ReservationOptionSelect name="proficiency" value={Proficiency} onChange={proficiencyHandler}>
                        <option value="">{t('levelselection.selection')}</option>
                        <option value="BEGINNER">{t('levelselection.beg')}</option>
                        <option value="INTERMEDIATE">{t('levelselection.int')}</option>
                        <option value="ADVANCED">{t('levelselection.adv')}</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

                <ReservationOptionWrapper>
                    <ReservationOptionText>
                        <div className="flex">
                            <span className="mr-3">Step5. {t('step5')}</span>
                            <span>
                                {Studytime ?
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 mt-1" /> : ""
                                }
                            </span>
                        </div>
                    </ReservationOptionText>
                    <ReservationOptionSelect name="studytime" value={Studytime} onChange={studytimeHandler}>
                        <option value="">{t('timeselection.selection')}</option>
                        <option value="17">{t('timeselection.sev')}</option>
                        <option value="18">{t('timeselection.eig')}</option>
                        <option value="19">{t('timeselection.nin')}</option>
                    </ReservationOptionSelect>
                </ReservationOptionWrapper>

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


                <ReservationSendButton disabled={allAnswerFulfiled()} className={allAnswerFulfiled() ? "bg-gray-400 cursor-default" : "bg-yellow-400"} onClick={submitHandler}>
                    {allAnswerFulfiled() ? t('allanswerfulfilled.no') : t('allanswerfulfilled.yes')}
                </ReservationSendButton>

            </ReservationQuestionWrapper>
        </ReservationWrapper>

    );
}

export default React.memo(ReservationForm);
