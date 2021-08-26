import React, { useEffect, useRef, useState } from "react";

import Logo from "../assets/images/logoVerpic.png";
import { ProfileAvatar } from "../User/Mypage";
import isAuthorized from "../Auth/isAuthorized";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useTranslation } from "react-i18next";

const NavigatorWrapper = styled.div`
  font-family: "NanumGothic-Bold";
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #25292e;
  ${tw` max-w-full h-5vh shadow-lg relative border-b-2 border-white`}
`;

const NavigatorLogo = styled.img`
  width: 50px;
  ${tw`m-3 cursor-pointer ml-20`}
`;

const NavigatorText = styled.text`
  font-family: "NanumGothic-Regular";
  @media screen and (max-width: 500px) {
    display: none;
  }
  ${tw`bg-clip-text my-auto font-black text-lg text-transparent bg-gradient-to-r from-blue-400 via-white to-gray-200 select-none`}
`;

const NavigatorLink = styled.div`
  font-family: "NanumGothic-Regular";
  color: #d9dee5;
  @media screen and (max-width: 500px) {
    display: none;
  }
  &:hover {
    color: #cddef5;
    border-bottom: 4px solid #cddef5;
  }
  &:focus {
    color: #cddef5;
    border-bottom: 4px solid #cddef5;
  }
  ${tw`text-sm font-semibold h-5vh overflow-hidden tracking-wider flex items-center align-middle mx-10 duration-300 cursor-pointer`}
`;

const AvatarLink = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`text-sm font-semibold h-5vh tracking-wider flex items-center align-middle mx-10 duration-300 cursor-pointer`}
`;

const DropDown = styled.div`
  ${tw`origin-top-right absolute top-5vh right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none`}
`;

const DropDownItem = styled.div`
  font-family: "NanumGothic-Regular";
  &:hover {
    background: #dcdce0;
  }
  ${tw`text-gray-700  px-4 py-3 text-sm font-semibold`}
`;

function Navigator({ user, focus }) {
  const { t, i18n } = useTranslation("navigator");
  const [pageLanguage, setPageLanguage] = useState(initPageLanguage());
  const [dropDown, setDropDown] = useState(false);

  const dropDownref = useRef();
  const avatarRef = useRef();

  function initPageLanguage() {
    if (localStorage.getItem("i18nextLng") === "login") {
      if (user !== null) {
        localStorage.setItem(
          "i18nextLng",
          user.firstLanguage === "KOR" ? "kr" : "en"
        );
      } else localStorage.setItem("i18nextLng", "kr");
    }
    return localStorage.getItem("i18nextLng");
  }

  const changeLanguage = () => {
    if (pageLanguage == "KOR") {
      setPageLanguage("ENG");
      localStorage.setItem("i18nextLng", "en");
      i18n.changeLanguage("en");
    } else {
      setPageLanguage("KOR");
      localStorage.setItem("i18nextLng", "kr");
      i18n.changeLanguage("kr");
    }
  };

  const avatarOnClick = () => {
    setDropDown(!dropDown);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropDownref.current &&
        !dropDownref.current.contains(event.target) &&
        !avatarRef.current.contains(event.target)
      ) {
        setDropDown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownref]);

  return (
    <>
      <NavigatorWrapper>
        <div className="flex">
          <NavigatorLogo
            onClick={() => (window.location.href = "/")}
            src={Logo}
          ></NavigatorLogo>
          <NavigatorText>Capture Your Picture</NavigatorText>
        </div>
        <div>
          {isAuthorized() ? (
            <div class="flex">
              <NavigatorLink onClick={() => (window.location.href = "/")}>
                <span
                  class={focus === "신청하기" ? "my-auto text-indigo-300" : ""}
                >
                  {t("reservation")}
                </span>
              </NavigatorLink>

              <NavigatorLink
                onClick={() => (window.location.href = "/topic/reservation")}
              >
                <div
                  class={focus === "신청목록" ? "my-auto text-indigo-300" : ""}
                >
                  {t("reservationlist")}
                </div>
              </NavigatorLink>
              <NavigatorLink>
                <div
                  class={focus === "피드백" ? "my-auto text-indigo-300" : ""}
                >
                  {t("feedback")}
                </div>
              </NavigatorLink>

              {user ? (
                <AvatarLink ref={avatarRef} onClick={avatarOnClick}>
                  <ProfileAvatar>
                    <span class="text-sm font-semibold">{user.firstName}</span>
                  </ProfileAvatar>
                </AvatarLink>
              ) : (
                ""
              )}
              {dropDown ? (
                <DropDown ref={dropDownref}>
                  <div class="h-5vh text-center">

                    <div class="flex m-4">
                      <ProfileAvatar >
                        <span class="text-sm font-semibold">{user.firstName}</span>
                      </ProfileAvatar>

                      <div class="my-auto mx-2 font-medium">
                        {user.lastName}{user.firstName}
                      </div>
                    </div>
                  </div>

                  <DropDownItem onClick={() => (window.location.href = "/profile/" + user.id)}>
                    {t('mypage')}
                  </DropDownItem>
                  <DropDownItem onClick={() => { window.location.href = "/edit/" + user.id }}>
                    {t('editUser')}
                  </DropDownItem>
                  <DropDownItem
                    onClick={() => (window.location.href = "/logout")}
                  >
                    <span class="text-red-600">{t("logout")}</span>
                  </DropDownItem>
                  <DropDownItem onClick={changeLanguage}>
                    {t("languagechange")}
                  </DropDownItem>
                </DropDown>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div class="flex">
              <NavigatorLink onClick={changeLanguage}>
                {t("languagechange")}
              </NavigatorLink>
              <NavigatorLink onClick={() => (window.location.href = "/login")}>
                <div
                  class={focus === "로그인" ? "my-auto text-indigo-300" : ""}
                >
                  {t("login")}
                </div>
              </NavigatorLink>

              <NavigatorLink onClick={() => (window.location.href = "/signup")}>
                <div
                  class={focus === "회원가입" ? "my-auto text-indigo-300" : ""}
                >
                  {t("signup")}
                </div>
              </NavigatorLink>
            </div>
          )}
        </div>
      </NavigatorWrapper>
    </>
  );
}
export default React.memo(Navigator);

Navigator.defaultProps = {
  user: null,
  focus: "신청하기",
};