import React, {useState} from 'react';

import tw from 'twin.macro';
import styled from '@emotion/styled';

import Logo from './logoVerpic.png';

const NavigatorWrapper = styled.div`
  display: flex;
  height: 70px;
  justify-content: space-between;
  align-items: center;
  padding: 30px 16px;
  ${tw`max-w-full bg-white rounded-lg shadow-lg`}
`;


const NavigatorLogo = styled.img`
  width:60px;
  ${tw`m-3`}
`;

const NavigatorText = styled.text`
  ${tw`bg-clip-text my-auto text-lg font-extrabold text-transparent bg-gradient-to-r from-blue-400 via-black to-gray-500`}
`;

const NavigatorLink = styled.text`
  ${tw`text-sm font-semibold text-black m-10 duration-500 text-right`}
`;


function Navigator() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <>
        <NavigatorWrapper>
          <div class="flex">
            <NavigatorLogo src={Logo}></NavigatorLogo>
            <NavigatorText>Capture Your Picture</NavigatorText>
          </div>
          <div> 
            <NavigatorLink> 신청하기 </NavigatorLink>
            <NavigatorLink> 예습하기 </NavigatorLink>
            <NavigatorLink> 피드백 </NavigatorLink>
          </div>
        </NavigatorWrapper>

    </>
  );
  }
  export default Navigator;