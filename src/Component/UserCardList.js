import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import tw from 'twin.macro';
import Card from './Card';
import DaySorting from './DaySorting';
import Pagination from './Pagination';
import Navigator from './Navigator';
import Cookies from 'universal-cookie';
import axios from 'axios';

import getuser from "../Api/getuser";
import isAuthorized from "../Auth/isAuthorized";

const CardListText = styled.div`

    ${tw`text-3xl font-bold mb-1 mt-10 mx-10 select-none`};
`;

const CardListWrapper = styled.div`
    font-family: "NanumGothic-Regular";
    ${tw`container mx-auto w-75vh`}
`;

function UserCardList(props) {
    const [reservation, setReservation] = useState();
    const [checkedItem, setCheckedItem] = useState("");
    const [filteredReservList, setFilteredReservList] = useState();
    const [today, setToday] = useState(getTodayLabel());
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsPerPage, setTopicsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState();



    const cookies = new Cookies();
    const token = cookies.get("vtoken");
    const { t, i18n } = useTranslation('cardlist');

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

    useEffect(() => {
        axios.get("/reservation/user/", {
            headers: {
                Authorization: token,
            }
        })
            .then((res) => {
                if (res.data) {
                    console.log(res.data);
                    setReservation(res.data);
                    setFilteredReservList(
                        res.data.filter(
                            reserv => reserv.topic.studyDay === today
                        )
                    );

                    setIsLoading(false);
                }
            })
            .catch((
                err => {
                    window.location.href = '/logout';
                }
            ))

    }, []);




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



    function setCurrentPageAndDay(day) {
        setToday(day);
        setFilteredReservList(
            reservation.filter(
                reserv => reserv.topic.studyDay === day
            )
        );
        setCurrentPage(1);
    }

    return (
        <>
            <Navigator user={user} focus="신청목록" />
            {isLoading ? <div className="text-center">{t('isloading')}</div> :
                <div>
                    <CardListWrapper>
                        <CardListText>{t('reservListText')}</CardListText>
                        <div class="text-gray-600 mb-3 mx-10 select-none">{t('cardlistlongtext')}</div>
                        <DaySorting dayPaginate={setCurrentPageAndDay} today={today} />
                        {
                            filteredReservList.length === 0 ?
                                <div class="text-center p-2">
                                    해당 요일에 예약한 토픽이 없어요.

                                </div> :
                                <>

                                    {
                                        filteredReservList.map(
                                            reserv => (
                                                <Card
                                                    topic={reserv.topic}
                                                    key={reserv.topic.id}
                                                    checkedItem={checkedItem}
                                                    isPreviewButton={true}
                                                    isOnclickActivate={false}
                                                />
                                            )
                                        )
                                    }

                                </>
                        }

                    </CardListWrapper>
                </div>
            }
        </>
    );
}

export default React.memo(UserCardList);