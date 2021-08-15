import React, { useState } from 'react';

import tw from 'twin.macro';
import styled from '@emotion/styled';
import Logo from '../assets/images/logoVerpic.png'
import isAuthorized from '../Auth/isAuthorized';

const NavigatorWrapper = styled.div`
    font-family: "NanumGothic-Bold";
    display: flex;
    height: 70px;
    justify-content: space-between;
    align-items: center;
    padding: 30px 16px;
  ${tw` max-w-full bg-white rounded-lg shadow-lg`}
`;


const NavigatorLogo = styled.img`
    width:60px;
    @media screen and (max-width: 500px) {
      width: 40px;
    }
    ${tw`m-3 cursor-pointer`}
`;

const NavigatorText = styled.text`

  @media screen and (max-width: 500px) {
    display: none;
  }
  ${tw`bg-clip-text my-auto text-lg font-extrabold text-transparent bg-gradient-to-r from-blue-400 via-black to-gray-500 select-none`}
`;

const NavigatorLink = styled.text`
  ${tw`text-sm font-semibold text-black m-10 duration-500 text-right cursor-pointer`}
`;


function Navigator() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
      <NavigatorWrapper>
        <div class="flex">
          <NavigatorLogo onClick={() => window.location.href = "/"} src={Logo}></NavigatorLogo>
          <NavigatorText>Capture Your Picture</NavigatorText>
        </div>
        <div>
          <NavigatorLink onClick={() => window.location.href = "/"} > 신청하기 </NavigatorLink>
          <NavigatorLink onClick={() => window.location.href = "/topic/reservation"}> 예습하기 </NavigatorLink>
          <NavigatorLink> 피드백 </NavigatorLink>

          {isAuthorized() ?
            <NavigatorLink onClick={() => window.location.href = "/logout"} > 로그아웃 </NavigatorLink>
            :
            <NavigatorLink onClick={() => window.location.href = "/login"}> 로그인 </NavigatorLink>
          }

        </div>
      </NavigatorWrapper>

    </>
  );
}
export default Navigator;