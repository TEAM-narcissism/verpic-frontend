import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from './Card';
import styled from '@emotion/styled';
import tw from 'twin.macro';
import ReservationForm from './ReservationForm';
import DaySorting from './DaySorting';
import Pagination from './Pagination';
import axios from 'axios';
import Cookies from 'universal-cookie';

const CardListText = styled.div`

    ${tw`text-3xl font-bold mb-1 mx-10 select-none`};
`;

const CardListWrapper = styled.div`
    font-family: "NanumGothic-Regular";
    ${tw`container mx-auto`}
`;

function CardList(props) {
    const [topics, setTopic] = useState([{
        theme: "", numOfParticipant: 0, studyDate: "", data: ""
    }]);
    const [checkedItem, setCheckedItem] = useState("");
    const [today, setToday] = useState(getTodayLabel());
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsPerPage, setTopicsPerPage] = useState(5);

    const cookies = new Cookies();
    const token = cookies.get('vtoken');

    useEffect(() => {
        axios.get('/topic/' + today, {
            headers: {
                'Authorization': token
            }
        })
            .then(res => setTopic(res.data))
            .catch(err => {
                window.location.ref = '/logout';
            })

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


                <div class="text-gray-600 mb-3 mx-10 select-none">버픽에서 이러한 토픽을 준비했어요.</div>

                <div class="">
                    <DaySorting dayPaginate={setCurrentPageAndDay} />
                </div>

                {
                    filteredTopicsByPaging.length === 0 ?
                        <div class="text-center font-lg font-semibold">
                            해당 요일에 토픽이 없어요.
                        </div> : ""}

                {
                    filteredTopicsByPaging.map((topic) => (
                        <Card topic={topic} checkedItemHandler={checkedItemHandler} key={topic.id} checkedItem={checkedItem} />
                    ))

                }
                {
                    filteredTopicsByPaging.length === 0 ?
                        <div></div> :
                        <div class="">
                            <Pagination topicsPerPage={topicsPerPage} totalTopics={topics.length} paginate={setCurrentPage} />
                        </div>

                }

            </CardListWrapper>
            <ReservationForm topicId={checkedItem} />
        </>

    );



}

export default React.memo(CardList);