import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from './Card';
import styled from '@emotion/styled';
import tw from 'twin.macro';
import ReservationForm from './ReservationForm';


const CardListText = styled.div`

    ${tw`text-3xl font-bold mb-1 mx-10 select-none`};
`;

const CardListWrapper = styled.div`
    font-family: "NanumGothic-Regular";
    ${tw`container mx-auto`}
`;

function CardList(props) {
    const [topics, setTopic] = useState([{ theme: "", numOfParticipant: 0, studyDate: "" }]);
    const [checkedItem, setCheckedItem] = useState("");
    const checkedItemHandler = (id) => {
        setCheckedItem(id);

        console.log(checkedItem);
    };


    useEffect(() => {
        fetch('/topic/MON')
            .then(response => response.json())
            .then(topics => {
                setTopic(topics)
            });
    }, []);


    return (
        <>
            <CardListWrapper>
    
                <CardListText>토픽 목록</CardListText>
                <div class="text-gray-600 mb-3 mx-10 select-none">버픽에서 이러한 토픽을 준비했어요.</div>
                {
                    topics.map((topic) => (
                        <Card topic={topic} checkedItemHandler={checkedItemHandler} key={topic.id} checkedItem={checkedItem} />
                    ))

                }

            </CardListWrapper>
            <ReservationForm topicId={checkedItem} />
        </>

    );



}

export default React.memo(CardList);