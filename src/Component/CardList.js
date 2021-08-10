import React, { useState, useEffect } from 'react';
import Card from './Card';
import styled from '@emotion/styled';
import tw from 'twin.macro';

function CardList() {
    const [topics, setTopic] = useState([{ theme: "", numOfParticipant: 0, studyDate: "" }]);


    const CardListText = styled.div`
        ${tw`text-3xl font-bold mb-1 mx-10`};
    `;

    const CardListWrapper = styled.div`

        ${tw `container mx-auto`}
    `;
    
    useEffect(() => {
        fetch('/topic/MON')
            .then(response => response.json())
            .then(topics => {
                setTopic(topics)
            });
    }, []);



    return (
        <CardListWrapper>
            <CardListText>토픽 목록</CardListText>
            <div class="text-gray-600 mb-3 mx-10">버픽에서 이러한 토픽을 준비했어요.</div>
            {topics.map((topic, i) => (
                <Card topic={topic} key={i} />
            )) }
        </CardListWrapper>


    );



}

export default CardList;