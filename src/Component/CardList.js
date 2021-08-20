import React, { useEffect, useState } from "react";

import Card from "./Card";
import Cookies from "universal-cookie";
import DaySorting from "./DaySorting";
import Pagination from "./Pagination";
import ReservationForm from "./ReservationForm";
import axios from "axios";
import styled from "@emotion/styled";
import tw from "twin.macro";

const CardListText = styled.div`
  ${tw`text-3xl font-bold mb-1 mx-10 select-none`};
`;

const CardListWrapper = styled.div`
  font-family: "NanumGothic-Regular";
  ${tw`container mx-auto overscroll-y-auto`}
`;

function CardList(props) {
  const [topics, setTopics] = useState([
    {
      theme: "",
      numOfParticipant: 0,
      studyDate: "",
      studyDay: "",
      data: "",
    },
  ]);

  const [isLoading, setIsLoading] = useState(true);
  const [checkedItem, setCheckedItem] = useState("");
  const [today, setToday] = useState(getTodayLabel());
  const [currentPage, setCurrentPage] = useState(1);
  const [topicsPerPage, setTopicsPerPage] = useState(5);

  const cookies = new Cookies();
  const token = cookies.get("vtoken");

  useEffect(() => {
    axios
      .get("/topic", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        setTopics(res.data);
        setIsLoading(false);
      }
      )
      .catch((err) => {
        window.location.ref = "/logout";
      });
  }, []);

  const checkedItemHandler = (id) => {
    if (id === checkedItem) {
      setCheckedItem(0);
    } else {
      setCheckedItem(id);
    }
    console.log(checkedItem);
  };

  function getTodayLabel() {
    let week = new Array("SUN", "MON", "TUES", "WED", "THUR", "FRI", "SAT");
    let today = new Date().getDay();
    let todayLabel = week[today];

    return todayLabel;
  }

  const monTopics = topics.filter(topic => { return topic.studyDay === "MON" });
  const tuesTopics = topics.filter(topic => { return topic.studyDay === "TUES" });
  const wedTopics = topics.filter(topic => { return topic.studyDay === "WED" });
  const thurTopics = topics.filter(topic => { return topic.studyDay === "THUR" });
  const friTopics = topics.filter(topic => { return topic.studyDay === "FRI" });
  const satTopics = topics.filter(topic => { return topic.studyDay === "SAT" });
  const sunTopics = topics.filter(topic => { return topic.studyDay === "SUN" });

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

  function setCurrentPageAndDay(day) {
    setToday(day);
    setCurrentPage(1);
  }

  return (
    <>
      {isLoading ? <div className="text-center">로딩중이에요..</div> :
        <>
          <CardListWrapper>
            <CardListText>토픽 목록</CardListText>

            <div className="text-gray-600 mb-3 mx-10 select-none">
              버픽에서 이러한 토픽을 준비했어요.
            </div>

            <div className="">
              <DaySorting dayPaginate={setCurrentPageAndDay} today={today} />
            </div>

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
          </CardListWrapper>
          <ReservationForm topicId={checkedItem} />
        </>}
    </>
  );
}

export default React.memo(CardList);
