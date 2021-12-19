import Modal, { ModalProvider } from "styled-react-modal";
import React, { useEffect, useRef, useState } from "react";

import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navigator from "components/Navigator/Navigator";
import axios from "axios";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import getTodayDate from "common/getTodayDate";

const EditUserInfoWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container w-35vw mx-auto bg-white text-black`}
`;

const EditUserInfoText = styled.div`
  ${tw`text-3xl font-bold pb-1 select-none pt-10 bg-gray-100`}
`;

const EditUserInfoQuestionWrapper = styled.div`
  ${tw`border rounded shadow-lg p-10`}
`;

const EditUserInfoInputWrapper = styled.div`
  ${tw`mx-auto mb-10`}
`;

const EditUserInfoInputText = styled.div`
  ${tw`font-semibold text-xl `}
`;

const EditUserInfoInput = styled.input`
  ${tw`ml-10 border rounded mt-4`}
`;

const EditUserInfoOptionText = styled.div`
  ${tw`font-semibold text-xl `}
`;
const EditUserInfoOptionWrapper = styled.div`
  ${tw`mx-auto mb-10`}
`;

const EditUserInfoOptionSelect = styled.select`
  ${tw`ml-10 border p-3 rounded mt-4`}
`;

const EditUserInfoSendButton = styled.button`
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
    firstName: "",
    lastName: "",
    birthDate: "",
    firstLanguage: "",
    learnLanguage: "",
  });
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  // const [email, setEmail] = useState("");
  const [Mothertongue, SetMothertongue] = useState("");
  const [Studylanguage, SetStudylanguage] = useState("");

  const modalRef = useRef();
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { t, i18n } = useTranslation("edituserinfo");

  const { userId } = useParams();

  useEffect(() => {
    axios.get("/api/users/" + userId).then((response) => {
      if (response.data.birthDate) {
        const birth = response.data.birthDate.split("T");
        let splitBirth = birth[0].split("-");
        let yesterday = new Date(parseInt(splitBirth[0]), parseInt(splitBirth[1]) - 1, parseInt(splitBirth[2]));
        let now = new Date(yesterday.setDate(yesterday.getDate() + 2));
        let filteredBirthDate = now.toISOString().split('T');
        setBirthDate(filteredBirthDate[0]);
      }
      console.log(response.data);
      console.log(response.data.birthDate);
      setUser(response.data);
      setFirstName(response.data.firstName);
      setLastName(response.data.lastName);

      SetMothertongue(response.data.firstLanguage);
      SetStudylanguage(response.data.learnLanguage);
    });
  }, []);

  function toggleModal() {
    setIsOpen(!isOpen);
  }

  const firstNameHandler = (e) => {
    e.preventDefault();
    setFirstName(e.target.value);
  };

  const lastNameHandler = (e) => {
    e.preventDefault();
    setLastName(e.target.value);
  };

  const birthDateHandler = (e) => {
    e.preventDefault();
    setBirthDate(e.target.value);
  };

  // const emailHandler = (e) => {
  //     e.preventDefault();
  //     setEmail(e.target.value);
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
    } else {
      return true;
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (Mothertongue === Studylanguage) {
      setModalContent(t("alert.languagedifferent"));
      setIsOpen(!isOpen);
      return;
    }

    let parsedBirthDate = birthDate.split("-");
    let birthdate;
    if (parsedBirthDate[1] === "01" && parsedBirthDate[2] === "01") {
      parsedBirthDate[0] = parseInt(parsedBirthDate[0]) - 1;
      parsedBirthDate[1] = "12";
      parsedBirthDate[2] = "31";
      birthdate =
        parsedBirthDate[0] +
        "-" +
        parsedBirthDate[1] +
        "-" +
        parsedBirthDate[2];
    } else {
      if (parseInt(parsedBirthDate[2]) <= 10) {
        birthdate =
          parsedBirthDate[0] +
          "-" +
          parsedBirthDate[1] +
          "-0" +
          (parseInt(parsedBirthDate[2]) - 1);
      }
      else {
        birthdate =
          parsedBirthDate[0] +
          "-" +
          parsedBirthDate[1] +
          "-" +
          (parseInt(parsedBirthDate[2]) - 1);
      }
    }

    let body = {
      firstName: firstName,
      lastName: lastName,
      birthDate: birthdate,
      firstLanguage: Mothertongue,
      learnLanguage: Studylanguage,
    };

    console.log("birthdate: " + birthdate);
    console.log("birthDate: " + birthDate);

    axios
      .put("/api/users/" + userId, body)
      .then((response) => {
        setModalContent(t("alert.editcomplete"));
        setIsOpen(!isOpen);
        console.log(response);
        window.location.href = "/";
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <ModalProvider>
      <Navigator user={user} focus="유저 정보 수정" />
      <div class="container max-w-full bg-gray-100 h-200vh">
        <EditUserInfoWrapper>
          <EditUserInfoText>{t("title")}</EditUserInfoText>

          <div class="text-gray-600 pb-3 select-none bg-gray-100">
            {t("explanation")}
          </div>

          <EditUserInfoQuestionWrapper>
            <EditUserInfoInputWrapper>
              <EditUserInfoInputText>
                <div class="flex">
                  <span class="mr-3">{t("firstname")}</span>
                  <span>
                    {firstName ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        class="text-green-500 w-5 mt-1"
                      />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </EditUserInfoInputText>
              <EditUserInfoInput
                type="text"
                name="firstName"
                value={firstName}
                onChange={firstNameHandler}
                required
              />
            </EditUserInfoInputWrapper>
            <EditUserInfoInputWrapper>
              <EditUserInfoInputText>
                <div class="flex">
                  <span class="mr-3">{t("lastname")}</span>
                  <span>
                    {lastName ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        class="text-green-500 w-5 mt-1"
                      />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </EditUserInfoInputText>
              <EditUserInfoInput
                type="text"
                name="lastName"
                value={lastName}
                onChange={lastNameHandler}
                required
              />
            </EditUserInfoInputWrapper>
            <EditUserInfoInputWrapper>
              <EditUserInfoInputText>
                <div class="flex">
                  <span class="mr-3">{t("birthdate")}</span>
                  <span>
                    {birthDate ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        class="text-green-500 w-5 mt-1"
                      />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </EditUserInfoInputText>
              <EditUserInfoInput
                type="date"
                max={getTodayDate()}
                name="birthDate"
                value={birthDate}
                onChange={birthDateHandler}
                required
              />
            </EditUserInfoInputWrapper>
            {/* <EditUserInfoInputWrapper>
                        <EditUserInfoInputText>
                            <div class="flex">
                                <span class="mr-3">Step4. {t('step4')}</span>
                                <span>
                                    {email ?
                                        <FontAwesomeIcon icon={faCheckCircle} class="text-green-500 w-5 mt-1" /> : ""
                                    }
                                </span>
                            </div>
                        </EditUserInfoInputText>
                        <EditUserInfoInput type="email" name="email" value={email} onChange={emailHandler} required />
                    </EditUserInfoInputWrapper> */}
            <EditUserInfoOptionWrapper>
              <EditUserInfoOptionText>
                <div class="flex">
                  <span class="mr-3">{t("mothertongue")}</span>
                  <span>
                    {Mothertongue ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        class="text-green-500 w-5 mt-1"
                      />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </EditUserInfoOptionText>
              <EditUserInfoOptionSelect
                name="mothertongue"
                value={Mothertongue}
                onChange={mothertongueHandler}
              >
                <option value="">{t("languageselection.selection")}</option>
                <option value="KOR">{t("languageselection.korean")}</option>
                <option value="ENG">{t("languageselection.english")}</option>
              </EditUserInfoOptionSelect>
            </EditUserInfoOptionWrapper>

            <EditUserInfoOptionWrapper>
              <EditUserInfoOptionText>
                <div class="flex">
                  <span class="mr-3">{t("learnlanguage")}</span>
                  <span>
                    {Studylanguage ? (
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        class="text-green-500 w-5 mt-1"
                      />
                    ) : (
                      ""
                    )}
                  </span>
                </div>
              </EditUserInfoOptionText>
              <EditUserInfoOptionSelect
                name="studylanguage"
                value={Studylanguage}
                onChange={studylanguageHandler}
              >
                <option value="">{t("languageselection.selection")}</option>
                <option value="KOR">{t("languageselection.korean")}</option>
                <option value="ENG">{t("languageselection.english")}</option>
              </EditUserInfoOptionSelect>
            </EditUserInfoOptionWrapper>
            <StyledModal
              isOpen={isOpen}
              onBackgroundClick={toggleModal}
              onEscapeKeydown={toggleModal}
            >
              <div class="text-center mt-28 text-xl" ref={modalRef}>
                {modalContent}
              </div>
              <div class="text-align">
                <ModalButton onClick={toggleModal}>
                  {t("modalbutton")}
                </ModalButton>
              </div>
            </StyledModal>
            <EditUserInfoSendButton
              disabled={allAnswerFulfiled()}
              className={
                allAnswerFulfiled()
                  ? "bg-gray-400 cursor-default"
                  : "bg-yellow-400"
              }
              onClick={submitHandler}
            >
              {allAnswerFulfiled()
                ? t("isallanswerfulfilled.no")
                : t("isallanswerfulfilled.yes")}
            </EditUserInfoSendButton>
          </EditUserInfoQuestionWrapper>
        </EditUserInfoWrapper>
      </div>
    </ModalProvider>
  );
}

export default React.memo(EditUserInfo);
