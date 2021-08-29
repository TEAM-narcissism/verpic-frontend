import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

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
import { faBars, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const FeedbackContentWrapper = styled.div`
    font-family: 'NanumGothic-Regular';
    background: #262624;
    border: 2px solid #262626;
    ${tw `flex justify-self-center mx-auto border-2 border-gray-300 w-full h-3/5`}
`;


function RepeatedWord({word}) {
    return (
    <div class="rounded-2xl bg-indigo-300 h-16 w-1/2 flex justify-between">
        <span class="flex m-2 my-auto text-lg">{word.key}. {word.word}</span>
        <span class="flex m-2 my-auto text-lg">{word.count}번</span>
    </div>
    );
}

function Vocabulary({repeatedWords}) {
    
    return (
        <div class="flex flex-col justify-between m-4 w-full">
            {repeatedWords.map((repeatedWord) => (
                <RepeatedWord word={repeatedWord}></RepeatedWord>
            ))}
        </div>
    );
}

function MatchList({match}) {
    return (
    <a href={"http://localhost:3000/feedback/" + match.id}>
        <li class="btn btn-ghost border-gray-400 w-full mt-2 relative text-gray-200">
            <p>{match.korTheme}</p>
            <p class="absolute bottom-0 right-1 text-xs">{match.date}</p>
        </li>
    </a>
    );
}




function Feedback() {
    
    const cookies = new Cookies();
    const { t, i18n } = useTranslation('feedback');
    var s = useRef("");
    const token = cookies.get('vtoken');
    const [user, setUser] = useState();
    const [selectedTab, setSelectedTab] = useState(1);
    const { matchId } = useParams();
    const [script, setScript] = useState([]);
    const [myId, setMyId] = useState();
    const [matchList, setMatchList] = useState([]);
    const nextChatId = useRef(1);
    const nextWordId = useRef(1);
    const [menu, setMenu] = useState(false)
    const [repeatedWords, setRepeatedWords] = useState([
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

    function TabBox({tabList, selectedTab, setSelectedTab}) {
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

    const addRepeatedWord = (word, count) => {
        const w = {
            key: nextWordId.current,
            word: word,
            count: count
        }
        setRepeatedWords(repeatedWords => repeatedWords.concat(w));
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
        const file = new Blob([s.current], {type: 'text/plain'});
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
            // 피드백들이 없는 경우 처리 필요!
            content.messages && content.messages.forEach((message) => {
                addChat(message.message, message.sender, message.userId)
                s.current += message.sender + ":" + message.message + "\n";
            })
            //console.log(content.analysisList[0].mostUsedWordList)
            // 여기두
            content.analysisList && content.analysisList[0].mostUsedWordList.forEach((w) => {
                addRepeatedWord(w.word, w.count);
            })
            //console.log("rerer", content.messages)
        })
        getParticipatedMatches(token)
        .then((content) => {
            content.data.forEach(match => {
                addFeedback(match);
            })
        })
    }, [])

    

    return (
    <div class="container max-w-full h-screen bg-white text-black">
        <Navigator user={user} focus="피드백"/>
        
        
        <div class={"rounded-lg drawer absolute w-1/3 h-4/5 z-10" + (menu ? "" : " hidden ")}>
            <input id="my-drawer" type="checkbox" class="drawer-toggle"></input>
            
            <div class="drawer-side w-full h-full">
                
                <label for="my-drawer" class="drawer-overlay"></label> 
                <ul class="p-4 overflow-y-auto h-full bg-black bg-opacity-30 text-base-content">
                <div class="flex drawer-content justify-end " onClick={() => setMenu(!menu)}>   
                    <label for="my-drawer" class="btn btn-outline border-0 text-white drawer-button">
                    <FontAwesomeIcon icon={faChevronLeft}></FontAwesomeIcon>
                    </label>
                </div>
                {matchList ? matchList.map((match) => (
                    <MatchList match={match}></MatchList>
                )) : null}
               
                {/* <li class="btn btn-ghost border-gray-700 w-full mt-2"><a href="#">Menu Item</a></li> */}
            </ul>
        </div>
        </div>
        <div class="flex flex-col mx-auto w-3/5 h-4/5">
            <span class="flex text-2xl">{t('feedback')}</span>
            <div class="flex gap-4 my-2 text-center">
                <div class="flex drawer-content " onClick={() => setMenu(!menu)}>   
                    <label for="my-drawer" class="btn btn-outline drawer-button text-black">
                    <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
                    </label>
                </div>
                
                <button class="btn btn-outline text-black" onClick={downloadScript}>{t("download")}</button>
            </div>
            <TabBox tabList={tabList} selectedTab={selectedTab} setSelectedTab={setSelectedTab} ></TabBox>
            <FeedbackContentWrapper>
                {selectedTab === 1 ? <ChatList chats={script} myId={myId}/> 
                : selectedTab === 2 ? <Vocabulary repeatedWords={repeatedWords}></Vocabulary> 
                : <div>분석</div>}
            </FeedbackContentWrapper>
                {/* <FeedbackContent tab={selectedTab}></FeedbackContent> */}
            
        </div>
    </div>
    
    );
}

export default Feedback;