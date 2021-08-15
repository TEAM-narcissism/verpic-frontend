import CardList from "../Component/CardList";
import { ModalProvider } from "styled-react-modal";
import Navigator from "../Component/Navigator";
import React from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";

function MainPage() {
  const HomeComponentWrapper = styled.div`
    font-family: "NotoSans-Bold";
    ${tw`container mx-auto flex my-10`}
  `;

  const onChangeTopicId = (data) => {
    console.log(data);
  };

  return (
    <>
      <ModalProvider>
        <Navigator />
        <HomeComponentWrapper>
          <CardList />
        </HomeComponentWrapper>
      </ModalProvider>
    </>
  );
}

export default React.memo(MainPage);
