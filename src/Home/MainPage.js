import Navigator from '../Component/Navigator';
import ReservationForm from '../Component/ReservationForm';
import CardList from '../Component/CardList';
import styled from '@emotion/styled';
import { useState, useRef } from 'react';
import tw from 'twin.macro';
import React from 'react';

function MainPage() {

    const HomeComponentWrapper = styled.div`
        font-family: "NotoSans-Bold";
        ${tw`container mx-auto flex my-10`}
    `;

    const onChangeTopicId = (data) => {
        console.log(data)

    }

    return (
        <>
            <Navigator />
            <HomeComponentWrapper>
                <CardList />
            </HomeComponentWrapper>
        </>
    );
}

export default React.memo(MainPage);