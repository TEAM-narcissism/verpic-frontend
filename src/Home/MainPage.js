import CardList from "../Reservation/TopicCardList";
import { ModalProvider } from "styled-react-modal";

import React from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";

import {connect} from 'react-redux';
import { getUser } from "store/actions";
import Navigator from 'components/Navigator/Navigator'


const HomeComponentWrapper = styled.div`
  font-family: "NotoSans-Bold";
${tw`container mx-auto flex my-10`}
`;




function MainPage({reducerUser, handleUser}) {

  return (
    <div class="container max-w-full bg-gray-100 h-200vh">

      <ModalProvider>
      
        <Navigator focus="신청하기" />
          <HomeComponentWrapper>
            <CardList />
          </HomeComponentWrapper>
      </ModalProvider>

    </div>
  );
}
const mapStateToProps = (state) => ({
  reducerUser: state.getUsers.user
});

const mapDispatchToProps = (dispatch) => ({
  handleUser: (key,value) => dispatch(getUser(key, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
