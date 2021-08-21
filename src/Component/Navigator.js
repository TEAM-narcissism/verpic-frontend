import React, { useState, useEffect } from "react";
import Logo from "../assets/images/logoVerpic.png";
import isAuthorized from "../Auth/isAuthorized";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useTranslation } from 'react-i18next';
import Cookies from 'universal-cookie';

import getuser from "../Api/getuser";
import { ClassNames } from "@emotion/react";

const NavigatorWrapper = styled.div`
  font-family: "NanumGothic-Bold";
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #25292E;
  ${tw` max-w-full h-5vh shadow-lg`}
`;

const NavigatorLogo = styled.img`
  width: 50px;
  @media screen and (max-width: 500px) {
    width: 40px;
  }
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

  color: #D9DEE5;

  &:hover {
    color: 	#CDDEF5;
    border-bottom: 4px solid #CDDEF5;
  }
  &:focus {
    color: 	#CDDEF5;
    border-bottom: 4px solid #CDDEF5;
  }
  ${tw` text-base font-black h-5vh tracking-wider mx-10  duration-300 align-middle cursor-pointer`}
`;

function Navigator({ user, focus }) {

  const { t, i18n } = useTranslation('navigator');
  const [isKorean, setIsKorean] = useState(false);

  const changeLanguage = () => {
    if (isKorean) {
      i18n.changeLanguage('en');
    }
    else {
      i18n.changeLanguage('ko');
    }
    setIsKorean(!isKorean);
  }

  return (
    <>
      <NavigatorWrapper>
        <div className="flex">
          <NavigatorLogo
            onClick={() => (window.location.href = "/")}
            src={Logo}
          ></NavigatorLogo>
          <NavigatorText>{t('navigatortext')}</NavigatorText>
        </div>
        <div>
          {isAuthorized() ?
            <div class="flex">
              <NavigatorLink onClick={changeLanguage}>{t('languagechange')}</NavigatorLink>
              <NavigatorLink onClick={() => (window.location.href = "/")}>


                <div class={focus === "신청하기" ? "mt-5 text-indigo-300" : "mt-5"}>{t('reservation')}</div>
              </NavigatorLink>

              <NavigatorLink onClick={() => window.location.href = "/topic/reservation"}>
                <div class={focus === "신청목록" ? "mt-5 text-indigo-300" : "mt-5"}>{t('reservationlist')}</div>
              </NavigatorLink>
              <NavigatorLink>
                <div class={focus === "피드백" ? "mt-5 text-indigo-300" : "mt-5"}>{t('feedback')}</div>
              </NavigatorLink>
              <NavigatorLink onClick={() => (window.location.href = "/profile/" + user.id)}>
                <div class={focus === "마이페이지" ? "mt-5 text-indigo-300" : "mt-5"}>{t('mypage')}</div>
              </NavigatorLink>
              <NavigatorLink onClick={() => (window.location.href = "/logout")}>
                <div class={focus === "로그아웃" ? "mt-5 text-indigo-300" : "mt-5"}>{t('logout')}</div>
              </NavigatorLink>
            </div>
            :
            <div class="flex">
              <NavigatorLink onClick={changeLanguage}>{t('languagechange')}</NavigatorLink>
              <NavigatorLink onClick={() => (window.location.href = "/login")}>
                <div class={focus === "로그인" ? "mt-5 text-indigo-300" : "mt-5"}>{t('login')}</div>
              </NavigatorLink>

              <NavigatorLink onClick={() => (window.location.href = "/signup")}>
                <div class={focus === "회원가입" ? "mt-5 text-indigo-300" : "mt-5"}>{t('signup')}</div>
              </NavigatorLink>
            </div>
          }
        </div>
      </NavigatorWrapper>
    </>
  );
}
export default React.memo(Navigator);

Navigator.defaultProps = {
  user: null,
  focus: "신청하기"
}