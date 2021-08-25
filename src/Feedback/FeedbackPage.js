import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import styled from '@emotion/styled';
import tw from 'twin.macro';
import Navigator from '../Component/Navigator';
import Cookies from 'universal-cookie';
import axios from 'axios';

import getuser from "../Api/getuser";
import isAuthorized from "../Auth/isAuthorized";
import getFeedbackScript from "../Api/getFeedbackScript"
import ChatList from '../VideoChat/ChatList';
import { useParams } from 'react-router-dom';
import { resolve } from 'q';
import { getSupportedCodeFixes } from 'typescript';

const FeedbackContentWrapper = styled.div`
    font-family: 'NanumGothic-Regular';
    background: #262624;
    border: 2px solid #262626;
    ${tw `justify-self-center mx-auto border-2 border-gray-300 w-full h-3/5 flex`}
`;

function FeedbackContent({tab}) {
    
}

function RepeatedWord({word}) {
    return (
    <div class="rounded-2xl bg-indigo-300 h-16 w-1/2 flex justify-between">
        <span class="flex m-2 my-auto text-lg">{word.key}. {word.word}</span>
        <span class="flex m-2 my-auto text-lg">{word.num}번</span>
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


function TabBox({tabList, selectedTab, setSelectedTab}) {

    return (
        <div class="tabs flex-wrap">
        {tabList.map((tab) => (
            <button class={"tab tab-lifted" + (tab.id === selectedTab ? " tab-active" : "")} onClick={() => setSelectedTab(tab.id)}>{tab.name}</button> 
        ))}
        </div>
    )
}


function Feedback() {
    
    const cookies = new Cookies();
    var s = useRef("");
    const token = cookies.get('vtoken');
    const [user, setUser] = useState();
    const [selectedTab, setSelectedTab] = useState(1);
    const matchId = useParams();
    const [script, setScript] = useState([]);
    const [myId, setMyId] = useState();
    const nextChatId = useRef(1);
    const nextWordId = useRef(1);
    const [menu, setMenu] = useState(false)
    const [repeatedWords, setRepeatedWords] = useState([
        // {
        //     key: 1,
        //     word: "apple",
        //     num: 10
        // },
        // {
        //     key: 2,
        //     word: "apple",
        //     num: 20
        // },
        // {
        //     key: 3,
        //     word: "apple",
        //     num: 30
        // },
        // {
        //     key: 4,
        //     word: "apple",
        //     num: 40
        // },
        // {
        //     key: 5,
        //     word: "apple",
        //     num: 50
        // }
    ]);
    const tabList = [
        {
        id: 1,
        name: "Script"
        },
        {
            id: 2,
            name: "어휘"
        },
        {
            id: 3,
            name: "분석"
        },
    ]

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
                })
                .catch((err) => {
                    alert('로그인 세션이 만료되었어요.');
                    window.location.href = '/logout';
                });
        }
        getFeedbackScript(token, matchId)
        .then((content => {
            setMyId(content.requestUserId);
            content.messages.forEach((message) => {
                addChat(message.message, message.sender, message.userId)
                s.current += message.sender + ":" + message.message + "\n";
            })
            console.log(content.analysisList[0].mostUsedWordList)
            content.analysisList[0].mostUsedWordList.forEach((w) => {
                addRepeatedWord(w.word, w.count);
            })
            console.log("rerer", content.messages)
        }))
    }, [])

    

    return (
    <div class="container max-w-full h-screen">
        <Navigator user={user} focus="신청목록" />
        
        <span class="text-2xl">피드백</span>
        <div class="flex flex-col items-center justify-center drawer-content" onClick={() => setMenu(!menu)}>
            <label for="my-drawer" class="btn btn-neutral drawer-button">open menu</label>
        </div>
        <button onClick={downloadScript}>다운로드</button>
        <div class={"rounded-lg shadow drawer drawer h-full fixed z-10" + (menu ? "" : " hidden ")}>
            <input id="my-drawer" type="checkbox" class="drawer-toggle"></input>
            
            <div class="drawer-side h-full">
                <label for="my-drawer" class="drawer-overlay"></label> 
                <ul class="p-4 overflow-y-auto w-80 bg-gray-300 bg-opacity-25 text-base-content">
                <li class="btn btn-ghost border-gray-500 w-full mt-2"><a href="#">Menu Item</a></li>
                <li class="btn btn-ghost border-gray-500 w-full mt-2"><a href="#">Menu Item</a></li>
            </ul>
        </div>
        </div>
        <div class="flex flex-col mx-auto w-3/5 h-4/5">
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