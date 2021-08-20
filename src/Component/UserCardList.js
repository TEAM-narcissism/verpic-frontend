import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import tw from 'twin.macro';
import Card from './Card';
import DaySorting from './DaySorting';
import Pagination from './Pagination';
import Navigator from './Navigator';
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
    const [topics, setTopics] = useState([{
        theme: "", numOfParticipant: 0, studyDate: "", studyDay: "", data: ""
    }])
    const [checkedItem, setCheckedItem] = useState("");
    const [today, setToday] = useState(getTodayLabel());
    const [currentPage, setCurrentPage] = useState(1);
    const [topicsPerPage, setTopicsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(true);

    const cookies = new Cookies();
    const token = cookies.get("vtoken");

    useEffect(() => {
        axios
            .get("/topic/reservationList", {
                headers: {
                    Authorization: token,
                },
            })
            .then(response => {
                console.log("rendering");
                setIsLoading(false);
                setTopics(response.data);
            })
            .catch((err) => {
                window.location.ref = "/logout";
            })
    }, []);

    const monTopics = topics.filter(topic => { return topic.studyDay === "MON" });
    const tuesTopics = topics.filter(topic => { return topic.studyDay === "TUES" });
    const wedTopics = topics.filter(topic => { return topic.studyDay === "WED" });
    const thurTopics = topics.filter(topic => { return topic.studyDay === "THUR" });
    const friTopics = topics.filter(topic => { return topic.studyDay === "FRI" });
    const satTopics = topics.filter(topic => { return topic.studyDay === "SAT" });
    const sunTopics = topics.filter(topic => { return topic.studyDay === "SUN" });

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

    const filteredMonTopicsByPaging = currentTopics(monTopics);
    const filteredTuesTopicsByPaging = currentTopics(tuesTopics);
    const filteredWedTopicsByPaging = currentTopics(wedTopics);
    const filteredThurTopicsByPaging = currentTopics(thurTopics);
    const filteredFriTopicsByPaging = currentTopics(friTopics);
    const filteredSatTopicsByPaging = currentTopics(satTopics);
    const filteredSunTopicsByPaging = currentTopics(sunTopics);
    // const filteredTopicsByPaging = currentTopics(topics);

    function setCurrentPageAndDay(day) {
        setToday(day);
        setCurrentPage(1);
    }

    return (
        <>
            <Navigator />
            {isLoading ? <div className="text-center">로딩중이에요..</div> :
                <div>
                    <CardListWrapper>
                        <CardListText>토픽 목록</CardListText>
                        <DaySorting dayPaginate={setCurrentPageAndDay} today={today} />
                        &nbsp;
                        <div class="text-gray-600 mb-3 mx-10 select-none">예약된 학습의 토픽입니다. 학습하기에 앞서 예습을 원하신다면 토픽을 클릭해주세요. 예습은 학습의 효과를 4배로 늘려준다는 연구결과도 있습니다. 그러므로 Verpic은 여러분의 적극적인 예습을 권장합니다!</div>
                        {/* {
                    filteredTopicsByPaging.map((topic) => (
                        <Card topic={topic} checkedItemHandler={checkedItemHandler} key={topic.id} checkedItem={checkedItem} isPreviewButton={true} />
                    ))

                } */}
                        {
                            today === "MON" ? (
                                monTopics.length === 0 ? (
                                    <div className="text-center font-lg font-semibold">
                                        해당 요일에 토픽이 없어요.
                                    </div>
                                ) : (
                                    filteredMonTopicsByPaging.map((topic) => (
                                        <Card
                                            topic={topic}
                                            checkedItemHandler={checkedItemHandler}
                                            key={topic.id}
                                            checkedItem={checkedItem}
                                            isPreviewButton={false}
                                        />
                                    ))
                                )
                            ) : (
                                today === "TUES" ? (
                                    tuesTopics.length === 0 ? (
                                        <div className="text-center font-lg font-semibold">
                                            해당 요일에 토픽이 없어요.
                                        </div>
                                    ) : (
                                        filteredTuesTopicsByPaging.map((topic) => (
                                            <Card
                                                topic={topic}
                                                checkedItemHandler={checkedItemHandler}
                                                key={topic.id}
                                                checkedItem={checkedItem}
                                                isPreviewButton={false}
                                            />
                                        ))
                                    )

                                ) : (
                                    today === "WED" ? (
                                        wedTopics.length === 0 ? (
                                            <div className="text-center font-lg font-semibold">
                                                해당 요일에 토픽이 없어요.
                                            </div>
                                        ) : (
                                            filteredWedTopicsByPaging.map((topic) => (
                                                <Card
                                                    topic={topic}
                                                    checkedItemHandler={checkedItemHandler}
                                                    key={topic.id}
                                                    checkedItem={checkedItem}
                                                    isPreviewButton={false}
                                                />
                                            ))
                                        )
                                    ) : (
                                        today === "THUR" ? (
                                            thurTopics.length === 0 ? (
                                                <div className="text-center font-lg font-semibold">
                                                    해당 요일에 토픽이 없어요.
                                                </div>
                                            ) : (
                                                filteredThurTopicsByPaging.map((topic) => (
                                                    <Card
                                                        topic={topic}
                                                        checkedItemHandler={checkedItemHandler}
                                                        key={topic.id}
                                                        checkedItem={checkedItem}
                                                        isPreviewButton={false}
                                                    />
                                                ))
                                            )
                                        ) : (
                                            today === "FRI" ? (
                                                friTopics.length === 0 ? (
                                                    <div className="text-center font-lg font-semibold">
                                                        해당 요일에 토픽이 없어요.
                                                    </div>
                                                ) : (
                                                    filteredFriTopicsByPaging.map((topic) => (
                                                        <Card
                                                            topic={topic}
                                                            checkedItemHandler={checkedItemHandler}
                                                            key={topic.id}
                                                            checkedItem={checkedItem}
                                                            isPreviewButton={false}
                                                        />
                                                    ))
                                                )
                                            ) : (
                                                today === "SAT" ? (
                                                    satTopics.length === 0 ? (
                                                        <div className="text-center font-lg font-semibold">
                                                            해당 요일에 토픽이 없어요.
                                                        </div>
                                                    ) : (
                                                        filteredSatTopicsByPaging.map((topic) => (
                                                            <Card
                                                                topic={topic}
                                                                checkedItemHandler={checkedItemHandler}
                                                                key={topic.id}
                                                                checkedItem={checkedItem}
                                                                isPreviewButton={false}
                                                            />
                                                        ))
                                                    )
                                                ) : (
                                                    sunTopics.length === 0 ? (
                                                        <div className="text-center font-lg font-semibold">
                                                            해당 요일에 토픽이 없어요.
                                                        </div>
                                                    ) : (
                                                        filteredSunTopicsByPaging.map((topic) => (
                                                            <Card
                                                                topic={topic}
                                                                checkedItemHandler={checkedItemHandler}
                                                                key={topic.id}
                                                                checkedItem={checkedItem}
                                                                isPreviewButton={false}
                                                            />
                                                        ))
                                                    )
                                                ))))))
                        }
                        {
                            today === "MON" ? (
                                monTopics.length === 0 ? (<div></div>) : (
                                    <div className="">
                                        <Pagination
                                            topicsPerPage={topicsPerPage}
                                            totalTopics={monTopics.length}
                                            paginate={setCurrentPage}
                                            currentPage={currentPage}
                                        />
                                    </div>
                                )

                            ) : (
                                today === "TUES" ? (
                                    tuesTopics.length === 0 ? (<div></div>) : (
                                        <div className="">
                                            <Pagination
                                                topicsPerPage={topicsPerPage}
                                                totalTopics={tuesTopics.length}
                                                paginate={setCurrentPage}
                                                currentPage={currentPage}
                                            />
                                        </div>
                                    )
                                ) : (
                                    today === "WED" ? (
                                        wedTopics.length === 0 ? (<div></div>) : (
                                            <div className="">
                                                <Pagination
                                                    topicsPerPage={topicsPerPage}
                                                    totalTopics={wedTopics.length}
                                                    paginate={setCurrentPage}
                                                    currentPage={currentPage}
                                                />
                                            </div>
                                        )
                                    ) : (
                                        today === "THUR" ? (
                                            thurTopics.length === 0 ? (<div></div>) : (
                                                <div className="">
                                                    <Pagination
                                                        topicsPerPage={topicsPerPage}
                                                        totalTopics={thurTopics.length}
                                                        paginate={setCurrentPage}
                                                        currentPage={currentPage}
                                                    />
                                                </div>
                                            )
                                        ) : (
                                            today === "FRI" ? (
                                                friTopics.length === 0 ? (<div></div>) : (
                                                    <div className="">
                                                        <Pagination
                                                            topicsPerPage={topicsPerPage}
                                                            totalTopics={friTopics.length}
                                                            paginate={setCurrentPage}
                                                            currentPage={currentPage}
                                                        />
                                                    </div>
                                                )
                                            ) : (
                                                today === "SAT" ? (
                                                    satTopics.length === 0 ? (<div></div>) : (
                                                        <div className="">
                                                            <Pagination
                                                                topicsPerPage={topicsPerPage}
                                                                totalTopics={satTopics.length}
                                                                paginate={setCurrentPage}
                                                                currentPage={currentPage}
                                                            />
                                                        </div>
                                                    )
                                                ) : (
                                                    satTopics.length === 0 ? (<div></div>) : (
                                                        <div className="">
                                                            <Pagination
                                                                topicsPerPage={topicsPerPage}
                                                                totalTopics={sunTopics.length}
                                                                paginate={setCurrentPage}
                                                                currentPage={currentPage}
                                                            />
                                                        </div>
                                                    )
                                                ))))))
                        }
                        {/* <Pagination topicsPerPage={topicsPerPage} totalTopics={topics.length} paginate={setCurrentPage} /> */}
                    </CardListWrapper>
                </div>
            }
        </>
    );
}

export default React.memo(UserCardList);