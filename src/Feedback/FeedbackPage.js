import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from "i18next";

import styled from '@emotion/styled';
import tw from 'twin.macro';
import Cookies from 'universal-cookie';
import axios from 'axios';

import Navigator from "../Common/Navigator";
import getuser from "../Api/getuser";
import isAuthorized from "../Auth/isAuthorized";
import getFeedbackScript from "../Api/getFeedbackScript"
import getParticipatedMatches from "../Api/getParticipatedMatches"

import ChatList from '../VideoChat/ChatList';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronLeft, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import WPMChart from './WPMChart';

const FeedbackContentWrapper = styled.div`
    font-family: 'NanumGothic-Regular';
    background: #262624;
    border: 2px solid #262626;
    ${tw`flex justify-self-center mx-auto border-2 border-gray-300 w-full h-3/5`}
`;


function RepeatedWord({ word }) {
    return (
        <div class="rounded-2xl bg-gray-400 h-16 w-full flex justify-between">
            <span class="flex m-2 my-auto text-lg">{word.key > 5 ? word.key - 5 : word.key}. {word.word}</span>
            <span class="flex m-2 my-auto text-lg">{word.count}번</span>
        </div>
    );
}

function Vocabulary({ repeatedWords }) {

    return (
        <>
            <div class="flex flex-col justify-between m-4 w-full">
                {repeatedWords[0].map((repeatedWord) => (
                    <RepeatedWord word={repeatedWord}></RepeatedWord>
                ))}
            </div>
            <div class="flex flex-col justify-between m-4 w-full">
                {repeatedWords[1].map((repeatedWord) => (
                    <RepeatedWord word={repeatedWord}></RepeatedWord>
                ))}
            </div>
        </>
    );
}

function MatchList({ match }) {
    return (
        <a href={"http://localhost:3000/feedback/" + match.id}>
            <li class="btn btn-ghost border-gray-400 w-full mt-2 relative text-gray-200">
                <p>{i18next.language === "kr" ? match.korTheme : match.engTheme}</p>
                <p class="absolute bottom-0 right-1 text-xs">{match.date}</p>
            </li>
        </a>
    );
}

const FeedbackWrapper = styled.div`
    font-family: "NanumGothic-Regular";
    ${tw`w-full h-full`}
`

function Feedback() {

    const cookies = new Cookies();
    const { t, i18n } = useTranslation('feedback');
    var s = useRef("");
    const token = cookies.get('vtoken');
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [user, setUser] = useState();
    const [selectedTab, setSelectedTab] = useState(1);
    const { matchId } = useParams();
    const [script, setScript] = useState([]);
    const [myId, setMyId] = useState();
    const [matchList, setMatchList] = useState([]);
    const nextChatId = useRef(1);
    const nextWordId = useRef(1);
    const [menu, setMenu] = useState(false)
    const [repeatedWordsKor, setRepeatedWordsKor] = useState(
        [
            // 테스트용 데이터
            // {
            //     word: "word1",
            //     count: 11,
            //     key: 1
            // },
            // {
            //     word: "word2",
            //     count: 22,
            //     key: 2
            // },{
            //     word: "word3",
            //     count: 33,
            //     key: 3
            // },{
            //     word: "word4",
            //     count: 44,
            //     key: 4
            // },{
            //     word: "word6",
            //     count: 55,
            //     key: 5
            // }
        ]);

    const [repeatedWordsEng, setRepeatedWordsEng] = useState(
        [
            // 테스트용 데이터
            // {
            //     word: "word11",
            //     count: 11,
            //     key: 1
            // },
            // {
            //     word: "word21",
            //     count: 22,
            //     key: 2
            // },{
            //     word: "word31",
            //     count: 33,
            //     key: 3
            // },{
            //     word: "word41",
            //     count: 44,
            //     key: 4
            // },{
            //     word: "word61",
            //     count: 55,
            //     key: 5
            // }
        ]);

    const tabList = [
        {
            key: 1,
            name: t("script")
        },
        {
            key: 2,
            name: t("vocabulary")
        },
        {
            key: 3,
            name: t("analysis")
        },
    ]

    const [wpmList, setWpmList] = useState([]);

    function TabBox({ tabList, selectedTab, setSelectedTab }) {
        return (
            <div class="tabs flex-wrap">
                {tabList.map((tab) => (
                    <button class={"tab tab-lifted text-black bg-white" + (tab.key === selectedTab ? " tab-active" : "")} onClick={() => setSelectedTab(tab.key)}>{tab.name}</button>
                ))}
            </div>
        )
    }

    const addChat = (message, sender, userId) => {
        const chat = {
            id: nextChatId.current,
            message: message,
            sender: sender,
            userId: userId,
        }
        setScript(script => script.concat(chat))
        nextChatId.current += 1;
    }

    const addRepeatedWordKor = (word, count) => {
        const w = {
            key: nextWordId.current,
            word: word,
            count: count
        }
        setRepeatedWordsKor(repeatedWordsKor => repeatedWordsKor.concat(w));
        nextWordId.current += 1;
    }

    const addRepeatedWordEng = (word, count) => {
        const w = {
            key: nextWordId.current,
            word: word,
            count: count
        }
        setRepeatedWordsEng(repeatedWordsEng => repeatedWordsEng.concat(w));
        nextWordId.current += 1;
    }

    const addFeedback = (match) => {
        const date = new Date(match.date)
        const m = {
            id: match.matchId,
            korTheme: match.korTheme,
            engTheme: match.engTheme,
            date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        }
        setMatchList(matchList => matchList.concat(m));
    }

    const downloadScript = () => {
        const element = document.createElement("a");
        const file = new Blob([s.current], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "myscript.txt";
        element.click();
    }


    useEffect(() => {
        // var content = JSON.parse("{\"requestUserId\":4,\"messages\":[{\"sender\":\"\uc601\uae30\ud638\",\"message\":\"\uc548\ub155 \ub098\ub294 \uae40\ud615\uae30 \uc57c \uc548\ub155 \ub098\ub294 \uc601\ud654\ubcf4\uae30\ub97c \uc88b\uc544\ud574 \uc548\ub155 \ub098\ub294 \ubba4\uc9c1\ube44\ub514\uc624 \ubcf4\uae30\ub97c \uc88b\uc544\ud574 \uc548\ub155 \ub098\ub294 \uc911\uc559\ub300\ud559\uad50\uc5d0 \ub2e4\ub2c8\uace0 \uc788\uc5b4 \uc548\ub155 \ub098\ub294 \uae38\uac70\ub9ac\ub97c \ub2e4\ub2c8\ub294 \uac83\uc744 \uc88b\uc544\ud574 \ub3d9\ud574\ubb3c\uacfc \ubc31\ub450\uc0b0\uc774 \ub9c8\ub974\uace0 \ub2f3\ub3c4\ub85d.\",\"userId\":4,\"order\":1,\"startSecond\":2.7,\"endSecond\":20.6}],\"analysisList\":[{\"mostUsedWordList\":[{\"word\":\"\ub098\",\"count\":5},{\"word\":\"\uc88b\uc544\ud558\",\"count\":3},{\"word\":\"\ubcf4\",\"count\":2},{\"word\":\"\ub2e4\ub2c8\",\"count\":2},{\"word\":\"\uae40\ud615\uae30\",\"count\":1}],\"wpm\":81.55339805825241,\"order\":1}]}")
        if (isAuthorized() && user === undefined) {
            getuser()
                .then((res) => {
                    console.log(res);
                    setUser(res);
                    axios
                        .get("/matching/participant-check/" + matchId + "/" + res.id)
                        .then((res) => {
                            if (!res.data.result) {
                                alert("정해진 참가자가 아니에요.");
                                window.location.href = "/";
                            }
                        });
                })
                .catch((err) => {
                    alert('로그인 세션이 만료되었어요.');
                    window.location.href = '/logout';
                });
        }
        getFeedbackScript(token, matchId)
            .then((content) => {
                console.log(content)
                setMyId(content.requestUserId);

                content.messages && content.messages.forEach((message) => {
                    addChat(message.message, message.sender, message.userId)
                    s.current += message.sender + ":" + message.message + "\n";
                })
                //console.log(content.analysisList[0].mostUsedWordList)
                // 여기두
                content.analysisList && content.analysisList[0].mostUsedWordList.forEach((w) => {
                    addRepeatedWordKor(w.word, w.count);
                })
                content.analysisList && content.analysisList[1].mostUsedWordList.forEach((w) => {
                    addRepeatedWordEng(w.word, w.count);
                })
                content.analysisList && setWpmList(wpmList => wpmList.concat({
                    key: 1,
                    name: "Me(KOR)",
                    wpm: content.analysisList[0].wpm,
                }));
                content.analysisList && setWpmList(wpmList => wpmList.concat({
                    key: 2,
                    name: "Me(ENG)",
                    wpm: content.analysisList[1].wpm,
                }))
            })
            .catch((err) => {
                //alert("피드백이 존재하지 않아요")
                setHasError(true);
                //window.location.href = '/feedback'
            })
        getParticipatedMatches(token)
            .then((content) => {
                content.data.forEach(match => {
                    addFeedback(match);
                })
            })
        //setIsLoaded(true);
    }, [])



    return (
        <div class="container max-w-full h-screen bg-white text-black">
            <Navigator user={user} focus="피드백" />

            <FeedbackWrapper>

                <div class={"rounded-lg drawer absolute w-1/3 h-5/6 z-10" + (menu ? "" : " hidden ")}>
                    <input id="my-drawer" type="checkbox" class="drawer-toggle"></input>

                    <div class="drawer-side w-full h-full">

                        <label for="my-drawer" class="drawer-overlay"></label>
                        <ul class="p-4 overflow-y-auto h-full bg-black bg-opacity-30 text-base-content">
                            <div class="flex drawer-content justify-end " onClick={() => setTimeout(() => setMenu(!menu), 150)}>
                                <label for="my-drawer" class="btn btn-outline border-0 text-white drawer-button">
                                    <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                                </label>
                            </div>
                            {matchList ? matchList.map((match) => (
                                <MatchList match={match}></MatchList>
                            )) : null}
                        </ul>
                    </div>
                </div>
                <div class="flex flex-col mx-auto w-3/5 h-4/5">
                    <span class="text-3xl font-bold mb-1 mt-10 text-black">{t('feedback')}</span>
                    <div class="flex gap-4 my-2 text-center">
                        <div class="flex drawer-content " onClick={() => setMenu(!menu)}>
                            <label for="my-drawer" class="btn btn-outline drawer-button text-black">
                                <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
                            </label>
                        </div>

                        <button class="btn btn-outline text-black" onClick={downloadScript}>{t("download")}</button>
                    </div>
                    <TabBox tabList={tabList} selectedTab={selectedTab} setSelectedTab={setSelectedTab} ></TabBox>
                    {!isLoaded ? hasError
                        ? <div class="flex">
                            <span class="flex mx-auto text-3xl font-bold mb-1 mt-10 text-black">
                                <FontAwesomeIcon icon={faExclamationTriangle}></FontAwesomeIcon>{t('nofeedback')}
                            </span>
                        </div>
                        : <div class="flex btn btn-lg btn-ghost loading mx-auto">loading</div> :
                        <FeedbackContentWrapper>
                            {selectedTab === 1 ? <ChatList chats={script} myId={myId} />
                                : selectedTab === 2 ? <Vocabulary repeatedWords={[repeatedWordsKor, repeatedWordsEng]}></Vocabulary>
                                    : <WPMChart data={wpmList}></WPMChart>}
                        </FeedbackContentWrapper>}

                </div>
            </FeedbackWrapper>
        </div>
    );
}

export default Feedback;