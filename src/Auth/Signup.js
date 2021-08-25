import React, { useState, useRef, useCallback } from 'react';
import Modal, { ModalProvider } from 'styled-react-modal';
import Cookies from 'universal-cookie';
import styled from "@emotion/styled";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Navigator from "../Common/Navigator";
import { useTranslation } from 'react-i18next';
import generateUuid from './generateUuid';

const SignupFormWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container w-50vh mx-auto mb-10 bg-white`}
`;

const SignupText = styled.div`
    font-family: "NanumGothic-Regular";
  ${tw`text-3xl font-bold pb-1 bg-gray-100 select-none`}
`;

const SignupQuestionWrapper = styled.div`
  ${tw`border rounded-lg shadow-lg p-10`}
`;

const SignupInputWrapper = styled.div`
    ${tw`mx-auto mb-10`}
`

const SignupInputText = styled.div`
    ${tw`font-semibold text-lg `}
`

const SignupInput = styled.input`
    ${tw`ml-10 border rounded mt-4`}
`

const SignupOptionText = styled.div`
  ${tw`font-semibold text-xl `}
`;
const SignupOptionWrapper = styled.div`
  ${tw`mx-auto text-sm mb-10`}
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

function Signup() {
    const [inputs, setInputs] = useState({
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password: "",
        motherTongue: "",
        studyLanguage: ""
    });

    const { firstName, lastName, birthDate, email, password, motherTongue, studyLanguage } = inputs;
    const [emailValid, setEmailValid] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const modalRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const { t, i18n } = useTranslation('signup');

    function toggleModal() {
        setIsOpen(!isOpen)
    }

    const onChange = (e) => {
        const { value, name } = e.target; // 우선 e.target 에서 name 과 value 를 추출

        if (name === "email") {
            checkEmail(e);
        } else if (name === "password") {
            checkPassword(e);
        }

        setInputs({
            ...inputs,
            [name]: value,
        });
    };


    const checkPassword = (e) => {
        var regExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
        const result = regExp.test(e.target.value);
        console.log('비밀번호 유효성 검사 :: ', result);
        setPasswordValid(result);

        if (!result && e.target.value) {
            setModalContent('비밀번호는 8자 이상이어야 하며, 숫자/대문자/소문자/특수문자를 모두 포함해야해요.');
            e.target.value = '';
            setIsOpen(!isOpen);
        }
    }

    // 이메일 유효성 검사
    const checkEmail = (e) => {
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i
        const result = regExp.test(e.target.value);
        console.log('이메일 유효성 검사 :: ', result)
        setEmailValid(result);

        if (!result && e.target.value) {
            setModalContent("이메일 형식이 유효하지 않아요.");
            e.target.value = '';
            setIsOpen(!isOpen);
        }
    }


    const allAnswerFulfiled = () => {

        if (firstName && lastName && birthDate && emailValid && password && motherTongue && studyLanguage) {
            return false;
        }
        else {
            return true;
        }
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (motherTongue === studyLanguage) {
            setModalContent(t('alert.languageerror'));
            setIsOpen(!isOpen);
            return;
        }

        let body = {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            email: email,
            password: password,
            firstLanguage: motherTongue,
            learnLanguage: studyLanguage,
        };

        axios
            .post("/join", body)
            .then((res) => {
                console.log(res);
                setModalContent(t('alert.signupcomplete'));
                setIsOpen(!isOpen);

                //회원가입에 성공하면 자동으로 로그인됨
                let loginbody = {
                    email: email,
                    password: password
                }
                axios.post("/login", loginbody)
                    .then((res) => {
                        console.log(res.data.data.Token);
                        const accessToken = res.data.data.Token;

                        const cookies = new Cookies();
                        cookies.set("vtoken", accessToken, { path: "/" });
                        window.location = "/";

                        if (localStorage.getItem("uuid") === null) {
                            localStorage.setItem("uuid", generateUuid());
                        }

                        window.location.href = "/"
                    })
                    .catch((err) => {
                        console.log(err.response);
                        if (err.response) {
                            const statusCode = err.response.data.httpStatus;
                            if (statusCode === "BAD_REQUEST") {
                                alert("잘못된 email 또는 password입니다.");
                            }
                            else {
                                alert("예상치 못한 오류입니다.");
                            }
                        }
                    })
            })
            .catch((err) => {
                if (err.response) {
                    const statusCode = err.response.data.httpStatus;
                    if (statusCode === "BAD_REQUEST") {
                        setModalContent(t('alert.alreadysignup'))
                        setIsOpen(!isOpen);
                    }
                    else {
                        setModalContent(t('alert.anothererror'))
                        setIsOpen(!isOpen);
                    }

                }
                console.log(err.response);
            });
    }

    return (
        <ModalProvider>

            <Navigator focus="회원가입" />
            <div class="pt-10 container h-200vh bg-gray-100 max-w-full">

                <SignupFormWrapper>
                    <SignupText>{t('signuptext')}</SignupText>
                    <div class="text-gray-600 pb-3 bg-gray-100 select-none">{t('signupexplanation')}</div>
                    <SignupQuestionWrapper>
                        <SignupInputWrapper>
                            <SignupInputText>
                                <div class="flex">
                                    <span class="mr-3">{t('step4')}</span>
                                    <span>
                                        {emailValid ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>
                            </SignupInputText>
                            <SignupInput type="email" name="email" onBlur={onChange} required />
                        </SignupInputWrapper>

                        <SignupInputWrapper>
                            <SignupInputText>
                                <div class="flex">
                                    <span class="mr-3">{t('step5')}</span>
                                    <span>
                                        {passwordValid ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>
                            </SignupInputText>
                            <SignupInput type="password" name="password" onBlur={onChange} required />
                        </SignupInputWrapper>

                        <SignupInputWrapper>
                            <SignupInputText>
                                <div class="flex">
                                    <span class="mr-3">{t('step1')}</span>
                                    <span>
                                        {firstName ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>
                            </SignupInputText>
                            <SignupInput
                                type="text"
                                name="firstName"
                                value={firstName}
                                label="이름"
                                onChange={onChange} required />
                        </SignupInputWrapper>
                        <SignupInputWrapper>
                            <SignupInputText>
                                <div class="flex">
                                    <span class="mr-3">{t('step2')}</span>
                                    <span>
                                        {lastName ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>
                            </SignupInputText>
                            <SignupInput type="text" name="lastName" value={lastName} onChange={onChange} required />
                        </SignupInputWrapper>
                        <SignupInputWrapper>
                            <SignupInputText>
                                <div class="flex">
                                    <span class="mr-3">{t('step3')}</span>
                                    <span>
                                        {birthDate ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>
                            </SignupInputText>
                            <SignupInput type="date" name="birthDate" onChange={onChange} required />
                        </SignupInputWrapper>

                        <SignupOptionWrapper>
                            <SignupOptionText>
                                <div class="flex">
                                    <span class="mr-3">{t('step7')}</span>
                                    <span>
                                        {motherTongue ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>

                            </SignupOptionText>
                            <SignupOptionSelect name="motherTongue" onChange={onChange}>
                                <option value="">{t('languageselection.selection')}</option>
                                <option value="KOR">{t('languageselection.kor')}</option>
                                <option value="ENG">{t('languageselection.eng')}</option>
                            </SignupOptionSelect>
                        </SignupOptionWrapper>

                        <SignupOptionWrapper>
                            <SignupOptionText>
                                <div class="flex">
                                    <span class="mr-3">{t('step8')}</span>
                                    <span>
                                        {studyLanguage ?
                                            <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                        }
                                    </span>
                                </div>
                            </SignupOptionText>
                            <SignupOptionSelect name="studyLanguage" onChange={onChange}>
                                <option value="">{t('languageselection.selection')}</option>
                                <option value="KOR">{t('languageselection.kor')}</option>
                                <option value="ENG">{t('languageselection.eng')}</option>
                            </SignupOptionSelect>
                        </SignupOptionWrapper>
                        <StyledModal
                            isOpen={isOpen}
                            onBackgroundClick={toggleModal}
                            onEscapeKeydown={toggleModal}
                        >

                            <div class="text-center mt-28 text-xl mx-3" ref={modalRef}>{modalContent}</div>
                            <div class="text-align">
                                <ModalButton onClick={toggleModal}>{t('modalbutton')}</ModalButton>
                            </div>
                        </StyledModal>
                        <SignupSendButton disabled={allAnswerFulfiled()} className={allAnswerFulfiled() ? "bg-gray-400 cursor-default" : "bg-yellow-400"} onClick={submitHandler}>
                            {allAnswerFulfiled() ? t('isallanswerfulfilled.no') : t('isallanswerfulfilled.yes')}
                        </SignupSendButton>

                    </SignupQuestionWrapper>

                </SignupFormWrapper >
            </div>
        </ModalProvider>
    );
}

export default React.memo(Signup);