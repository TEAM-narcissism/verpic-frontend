import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router';
import Modal, { ModalProvider } from 'styled-react-modal';
import Cookies from 'universal-cookie';
import styled from "@emotion/styled";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Navigator from "../Common/Navigator";
import { useTranslation } from 'react-i18next';

const SignupFormWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container ml-20  mr-10 mb-10`}
`;

const SignupText = styled.div`
  ${tw`text-3xl font-bold mb-1 select-none`}
`;

const SignupQuestionWrapper = styled.div`
  ${tw`border rounded shadow-lg p-10`}
`;

const SignupInputWrapper = styled.div`
    ${tw`mx-auto mb-10`}
`

const SignupInputText = styled.div`
    ${tw`font-semibold text-xl `}
`

const SignupInput = styled.input`
    ${tw`ml-10 border rounded mt-4`}
`

const SignupOptionText = styled.div`
  ${tw`font-semibold text-xl `}
`;
const SignupOptionWrapper = styled.div`
  ${tw`mx-auto mb-10`}
`;

const SignupOptionSelect = styled.select`
  ${tw`ml-10 border p-3 rounded mt-4`}
`;

const SignupSendButton = styled.button`
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

function EditUserInfo() {
    const [user, setUser] = useState({
        firstName: "", lastName: "", birthDate: "", firstLanguage: "", learnLanguage: "",
    })
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    // const [email, setEmail] = useState("");
    const [Mothertongue, SetMothertongue] = useState("");
    const [Studylanguage, SetStudylanguage] = useState("");

    const modalRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    // const { t, i18n } = useTranslation('edituserinfo');

    const { userId } = useParams();

    useEffect(() => {
        axios.get("/users/" + userId)
            .then((response) => {
                const birth = response.data.birthDate.split('T');
                let splitBirth = birth[0].split('-');
                let filteredBirthDate;
                if (splitBirth[1] === "12" && splitBirth[2] === "31") {
                    splitBirth[0] = parseInt(splitBirth[0]) + 1;
                    splitBirth[1] = "01";
                    splitBirth[2] = "01";
                    filteredBirthDate = splitBirth[0] + '-' + splitBirth[1] + '-' + splitBirth[2];
                }
                else {
                    filteredBirthDate = splitBirth[0] + '-' + splitBirth[1] + '-' + (parseInt(splitBirth[2]) + 1);
                }
                console.log(response.data);
                console.log(response.data.birthDate);
                setUser(response.data);
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setBirthDate(filteredBirthDate);
                SetMothertongue(response.data.firstLanguage);
                SetStudylanguage(response.data.learnLanguage);
            })
    }, [])




    function toggleModal() {
        setIsOpen(!isOpen)
    }

    const firstNameHandler = (e) => {
        e.preventDefault();
        setFirstName(e.target.value);
    }

    const lastNameHandler = (e) => {
        e.preventDefault();
        setLastName(e.target.value);
    }

    const birthDateHandler = (e) => {
        e.preventDefault();
        setBirthDate(e.target.value);
    }

    // const emailHandler = (e) => {
    //     e.preventDefault();
    //     setEmail(e.target.value);
    // }

    // const passwordHandler = (e) => {
    //     e.preventDefault();
    //     setPassword(e.target.value);
    // }

    const mothertongueHandler = (e) => {
        e.preventDefault();
        SetMothertongue(e.target.value);
    };

    const studylanguageHandler = (e) => {
        e.preventDefault();
        SetStudylanguage(e.target.value);
    };

    const allAnswerFulfiled = () => {
        if (firstName && lastName && birthDate && Mothertongue && Studylanguage) {
            return false;
        }
        else { return true };
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (Mothertongue === Studylanguage) {
            setModalContent("Mothertongue and StudyLanguage should be different!");
            setIsOpen(!isOpen);
            return;
        }

        let parsedBirthDate = birthDate.split('-');
        let birthdate;
        if (parsedBirthDate[1] === "01" && parsedBirthDate[2] === "01") {
            parsedBirthDate[0] = parseInt(parsedBirthDate[0]) - 1;
            parsedBirthDate[1] = "12";
            parsedBirthDate[2] = "31";
            birthdate = parsedBirthDate[0] + '-' + parsedBirthDate[1] + '-' + parsedBirthDate[2];
        }
        else {
            birthdate = parsedBirthDate[0] + '-' + parsedBirthDate[1] + '-' + (parseInt(parsedBirthDate[2]) - 1);
        }

        let body = {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthdate,
            firstLanguage: Mothertongue,
            learnLanguage: Studylanguage,
        };

        axios
            .put("/users/" + userId, body)
            .then((response) => {
                setModalContent("User Info Edit Complete!");
                setIsOpen(!isOpen);
                console.log(response);
                window.location.href = "http://localhost:3000/";
            })
            .catch((error) => {
                console.log(error);
            })

    }

    return (
        <ModalProvider>
            <Navigator />
            <SignupFormWrapper>
                <SignupText>회원 정보 수정</SignupText>


                <div class="text-gray-600 mb-3 select-none">회원님의 성, 이름, 생일, 모국어, 학습 언어를 수정하실 수 있습니다.</div>

                <SignupQuestionWrapper>
                    <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step1</span>
                                <span>
                                    {firstName ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="text" name="firstName" value={firstName} onChange={firstNameHandler} required />
                    </SignupInputWrapper>
                    <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step2</span>
                                <span>
                                    {lastName ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="text" name="lastName" value={lastName} onChange={lastNameHandler} required />
                    </SignupInputWrapper>
                    <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step3</span>
                                <span>
                                    {birthDate ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="date" name="birthDate" value={birthDate} onChange={birthDateHandler} required />
                    </SignupInputWrapper>
                    {/* <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step4. {t('step4')}</span>
                                <span>
                                    {email ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="email" name="email" value={email} onChange={emailHandler} required />
                    </SignupInputWrapper> */}
                    {/* <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step5. {t('step5')}</span>
                                <span>
                                    {password ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="password" name="password" value={password} onChange={passwordHandler} required />
                    </SignupInputWrapper> */}
                    <SignupOptionWrapper>
                        <SignupOptionText>
                            <div class="flex">
                                <span class="mr-3">Step7</span>
                                <span>
                                    {Mothertongue ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>

                        </SignupOptionText>
                        <SignupOptionSelect name="mothertongue" value={Mothertongue} onChange={mothertongueHandler}>
                            <option value="">selection</option>
                            <option value="KOR">korean</option>
                            <option value="ENG">english</option>
                        </SignupOptionSelect>
                    </SignupOptionWrapper>

                    <SignupOptionWrapper>
                        <SignupOptionText>
                            <div class="flex">
                                <span class="mr-3">Step8.</span>
                                <span>
                                    {Studylanguage ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupOptionText>
                        <SignupOptionSelect name="studylanguage" value={Studylanguage} onChange={studylanguageHandler}>
                            <option value="">selection</option>
                            <option value="KOR">korean</option>
                            <option value="ENG">english</option>
                        </SignupOptionSelect>
                    </SignupOptionWrapper>
                    <StyledModal
                        isOpen={isOpen}
                        onBackgroundClick={toggleModal}
                        onEscapeKeydown={toggleModal}
                    >

                        <div class="text-center mt-28 text-xl" ref={modalRef}>{modalContent}</div>
                        <div class="text-align">
                            <ModalButton onClick={toggleModal}>OK</ModalButton>
                        </div>
                    </StyledModal>
                    <SignupSendButton disabled={allAnswerFulfiled()} className={allAnswerFulfiled() ? "bg-gray-400 cursor-default" : "bg-yellow-400"} onClick={submitHandler}>
                        {allAnswerFulfiled() ? "Fill out all the information" : "Edit"}
                    </SignupSendButton>

                </SignupQuestionWrapper>

            </SignupFormWrapper >
        </ModalProvider>
    );
}

export default React.memo(EditUserInfo);