import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';
import Card from './Card';
import DaySorting from './DaySorting';
import Pagination from './Pagination';
import Cookies from 'universal-cookie';
import axios from 'axios';

const CardListText = styled.div`

    ${tw`text-3xl font-bold mb-1 mx-10 select-none`};
`;

const CardListWrapper = styled.div`
    font-family: "NanumGothic-Regular";
    ${tw`container mx-auto`}
`;

function UserCardList(props) {
    const cookies = new Cookies();
    const token = cookies.get('vtoken');
    const data = {
        headers: { 'Authorization': token }
    };
    const [topics, setTopic] = useState([{
        theme: "", numOfParticipant: 0, studyDate: "", data: ""
    }])
    const [checkedItem, setCheckedItem] = useState("");
    const [today, setToday] = useState(getTodayLabel());
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsPerPage, setTopicsPerPage] = useState(5);

    useEffect(() => {
        axios.get('/topic/reservationList/' + today, data)
            .then(response => {
                console.log(response.data);
                setTopic(response.data);
            });
    }, [today]);

    const checkedItemHandler = (id) => {
        setCheckedItem(id);

        console.log(checkedItem);
    };

    function getTodayLabel() {
        let week = new Array('SUN', 'MON', 'TUES', 'WED', 'THUR', 'FRI', 'SAT');
        let today = new Date().getDay();
        let todayLabel = week[today];

        return todayLabel;
    }

    const indexOfLast = currentPage * topicsPerPage;
    const indexOfFirst = indexOfLast - topicsPerPage;
    function currentTopics(tmp) {
        let currentTopics = 0;
        currentTopics = tmp.slice(indexOfFirst, indexOfLast);
        return currentTopics;
    }

    const filteredTopicsByPaging = currentTopics(topics);

    function setCurrentPageAndDay(day) {
        setToday(day);
        setCurrentPage(1);
    }

    return (
        <>
            <CardListWrapper>
                <CardListText>토픽 목록</CardListText>
                <DaySorting dayPaginate={setCurrentPageAndDay} />
                &nbsp;
                <div class="text-gray-600 mb-3 mx-10 select-none">예약된 학습의 토픽입니다. 학습하기에 앞서 예습을 원하신다면 토픽을 클릭해주세요. 예습은 학습의 효과를 4배로 늘려준다는 연구결과도 있습니다. 그러므로 Verpic은 여러분의 적극적인 예습을 권장합니다!</div>
                {
                    filteredTopicsByPaging.map((topic) => (
                        <Card topic={topic} checkedItemHandler={checkedItemHandler} key={topic.id} checkedItem={checkedItem} isPreviewButton={true} />
                    ))

                }
                <Pagination topicsPerPage={topicsPerPage} totalTopics={topics.length} paginate={setCurrentPage} />
            </CardListWrapper>
        </>
    );
}

export default React.memo(UserCardList);