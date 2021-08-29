import CardList from "../Reservation/TopicCardList";
import { ModalProvider } from "styled-react-modal";
import Navigator from "../Common/Navigator";
import React, { useState, useEffect, createContext } from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";
import getuser from "../Api/getuser";
import isAuthorized from "../Auth/isAuthorized";



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
        
    }
  })

  return (
    <div class="container max-w-full bg-gray-100 h-200vh">


      <ModalProvider>
        {user ?
          <Navigator user={user} focus="신청하기" /> : <></>}
        <HomeComponentWrapper>
          <CardList />
        </HomeComponentWrapper>
      </ModalProvider>

    </div>
  );
}

export default React.memo(MainPage);
