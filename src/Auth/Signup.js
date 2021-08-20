import React, { useState, useRef } from 'react';
import Modal, { ModalProvider } from 'styled-react-modal';
import Cookies from 'universal-cookie';
import styled from "@emotion/styled";
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

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

function Signup() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [Mothertongue, SetMothertongue] = useState("");
    const [Studylanguage, SetStudylanguage] = useState("");

    const modalRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");

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

    const emailHandler = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    }

    const passwordHandler = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
    }

    const mothertongueHandler = (e) => {
        e.preventDefault();
        SetMothertongue(e.target.value);
    };

    const studylanguageHandler = (e) => {
        e.preventDefault();
        SetStudylanguage(e.target.value);
    };

    const allAnswerFulfiled = () => {
        if (firstName && lastName && birthDate && email && password &&
            Mothertongue && Studylanguage) {
            return false;
        }
        else { return true };
    }

    const submitHandler = (e) => {
        e.preventDefault();

        if (Mothertongue === Studylanguage) {
            setModalContent("모국어와 공부할 언어는 달라야 해요.")
            setIsOpen(!isOpen);
            return;
        }

        let body = {
            firstName: firstName,
            lastName: lastName,
            birthDate: birthDate,
            email: email,
            password: password,
            picture: "picture",
            firstLanguage: Mothertongue,
            learnLanguage: Studylanguage,
        };

        axios
            .post("/join", body)
            .then((res) => {
                console.log(res);
                setModalContent("Verpic의 회원이 되신 것을 환영합니다~!");
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

                        function generateUuid() {
                            return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
                                /[xy]/g,
                                function (c) {
                                    let r = (Math.random() * 16) | 0,
                                        v = c === "x" ? r : (r & 0x3) | 0x8;
                                    return v.toString(16);
                                }
                            );
                        }

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
                        setModalContent("이미 가입된 회원입니다.")
                        setIsOpen(!isOpen);
                    }
                    else {
                        setModalContent("날짜 형식 오류입니다.")
                        setIsOpen(!isOpen);
                    }

                }
                console.log(err.response);
            });
    }

    return (
        <ModalProvider>
            <SignupFormWrapper>
                <SignupText>회원 가입</SignupText>


                <div class="text-gray-600 mb-3 select-none">아래의 항목들을 모두 작성해주세요.</div>

                <SignupQuestionWrapper>
                    <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step1. 당신의 이름을 입력해주세요.</span>
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
                                <span class="mr-3">Step2. 당신의 성을 입력해주세요.</span>
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
                                <span class="mr-3">Step3. 당신의 생일을 입력해주세요.</span>
                                <span>
                                    {birthDate ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="date" name="birthDate" value={birthDate} onChange={birthDateHandler} required />
                    </SignupInputWrapper>
                    <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step4. 당신의 email을 입력해주세요.</span>
                                <span>
                                    {email ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="email" name="email" value={email} onChange={emailHandler} required />
                    </SignupInputWrapper>
                    <SignupInputWrapper>
                        <SignupInputText>
                            <div class="flex">
                                <span class="mr-3">Step5. 당신의 비밀번호를 입력해주세요.</span>
                                <span>
                                    {password ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupInputText>
                        <SignupInput type="password" name="password" value={password} onChange={passwordHandler} required />
                    </SignupInputWrapper>
                    <SignupOptionWrapper>
                        <SignupOptionText>
                            <div class="flex">
                                <span class="mr-3">Step7. 당신의 모국어를 선택해주세요.</span>
                                <span>
                                    {Mothertongue ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>

                        </SignupOptionText>
                        <SignupOptionSelect name="mothertongue" value={Mothertongue} onChange={mothertongueHandler}>
                            <option value="">선택</option>
                            <option value="KOR">korean</option>
                            <option value="ENG">english</option>
                        </SignupOptionSelect>
                    </SignupOptionWrapper>

                    <SignupOptionWrapper>
                        <SignupOptionText>
                            <div class="flex">
                                <span class="mr-3">Step8. 공부하실 언어를 선택해주세요.</span>
                                <span>
                                    {Studylanguage ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </SignupOptionText>
                        <SignupOptionSelect name="studylanguage" value={Studylanguage} onChange={studylanguageHandler}>
                            <option value="">선택</option>
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
                            <ModalButton onClick={toggleModal}>확인</ModalButton>
                        </div>
                    </StyledModal>
                    <SignupSendButton disabled={allAnswerFulfiled()} className={allAnswerFulfiled() ? "bg-gray-400 cursor-default" : "bg-yellow-400"} onClick={submitHandler}>
                        {allAnswerFulfiled() ? "모든 항목을 작성해주세요." : "회원 가입"}
                    </SignupSendButton>

                </SignupQuestionWrapper>

            </SignupFormWrapper >
        </ModalProvider>
    );
}

export default React.memo(Signup);