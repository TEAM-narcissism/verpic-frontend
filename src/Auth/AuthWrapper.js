import React from "react";
import logo from "../assets/images/logoVerpic.png";
import styled from "styled-components";
import tw from "twin.macro";

// 화면의 중앙에 위치시킨다
const Positioner = styled.div`
  width: 2px;
  ${tw`container mt-20 mx-auto`}
`;

// 너비, 그림자 설정
const ShadowedBox = styled.div`
  width: 400px;
  ${tw`mx-auto border-2 rounded-xl p-2 bg-white`}
`;

// 로고
const LogoWrapper = styled.div`
  height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${tw`mr-5`}
`;

// children 이 들어가는 곳
const Contents = styled.div`
  background: white;
  padding: 2rem;
  height: auto;
`;

const LoginTeamLogo = styled.img`
  width: 50px;
  @media screen and (max-width: 500px) {
    width: 40px;
  }
  ${tw`m-2`}
`;

const LoginTeamText = styled.text`
    font-family: 'NotoSans-Regular';
  ${tw`bg-clip-text my-auto text-4xl font-extrabold text-transparent bg-gradient-to-r from-blue-400 via-black to-gray-500`}
`;

const AuthWrapper = ({ children }) => (
  <Positioner>
    <ShadowedBox>
      <LogoWrapper>
        <LoginTeamLogo src={logo}></LoginTeamLogo>
        <LoginTeamText>VERPIC</LoginTeamText>
      </LogoWrapper>
      <Contents>{children}</Contents>
    </ShadowedBox>
  </Positioner>
);

export default AuthWrapper;
