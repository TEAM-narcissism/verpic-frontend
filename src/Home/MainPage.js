import CardList from "../Component/CardList";
import { ModalProvider } from "styled-react-modal";
import Navigator from "../Component/Navigator";
import React, { useState, useEffect, createContext } from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";
import getuser from "../Api/getuser";
import Cookies from "universal-cookie";
import isAuthorized from "../Auth/isAuthorized";
import TestingComponent from "../User/TestingComponent";


const HomeComponentWrapper = styled.div`
  font-family: "NotoSans-Bold";
${tw`container mx-auto flex my-10`}
`;


export const UserContext = createContext();


function MainPage() {
  const [user, setUser] = useState();


  useEffect(async () => {
    if (isAuthorized() && user === undefined) {
      await getuser()
        .then((res) => {
          console.log(res);
          setUser(res);
        })
        .catch((err) => {
          alert('로그인 세션이 만료되었어요.');
          window.location.href = '/logout';
        })
    }
  })



  return (
    <>


      <ModalProvider>
        {user ?
          <Navigator user={user} /> : <Navigator />}
        <HomeComponentWrapper>
          <CardList />
        </HomeComponentWrapper>
      </ModalProvider>

    </>
  );
}

export default React.memo(MainPage);
