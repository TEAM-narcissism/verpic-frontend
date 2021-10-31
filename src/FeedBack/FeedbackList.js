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
import getParticipatedMatches from "../Api/getParticipatedMatches"

function MatchList({ match }) {
    return (
        <a href={window.location.href + "/feedback/" + match.id}>
            <li class="flex btn btn-outline btn-neutral border-gray-400 w-11/12 mt-2 mx-auto relative text-black hover:bg-neutral hover:text-white">
                <p>{i18next.language === "kr" ? match.korTheme : match.engTheme}</p>
                <p class="absolute bottom-0 right-1 text-xs">{match.date}</p>
            </li>
        </a>
    );
}

const FeedbackListWrapper = styled.div`
    font-family: 'NanumGothic-Regular';
    ${tw`flex flex-col mx-auto w-3/5 h-4/5`}
`

function FeedbackList() {

    const cookies = new Cookies();
    const token = cookies.get('vtoken')
    const [user, setUser] = useState();
    const [userLoad, setUserLoad] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [feedbacks, setFeedbacks] = useState([]);
    const [t, i18n] = useTranslation("feedbacklist");

    const addFeedback = (match) => {
        const date = new Date(match.date)
        const m = {
            id: match.matchId,
            korTheme: match.korTheme,
            engTheme: match.engTheme,
            date: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
        }
        setFeedbacks(feedbacks => feedbacks.concat(m));
    }

    useEffect(() => {
        if (isAuthorized() && user === undefined) {
            getuser()
                .then((res) => {
                    console.log(res);
                    setUser(res);
                    setUserLoad(true);
                })
                .catch((err) => {
                    alert('로그인 세션이 만료되었어요.');
                    window.location.href = '/logout';
                });
        }

        getParticipatedMatches(token)
            .then((content) => {
                content.data.forEach(match => {
                    addFeedback(match);
                })
                setIsLoaded(true);
            })
    }, [])

    return (
        <div class="container max-w-full h-screen bg-white text-black">
            {userLoad ? <Navigator user={user} focus="피드백" /> : null}
            <FeedbackListWrapper>
                <div class="text-3xl font-bold mb-1 mt-10 text-black ">{t('feedbacklist')}</div>
                <div class="text-gray-600 mb-3 select-none">{t('feedbacklistlong')}</div>
                <div class="divider" />
                <div class="flex flex-col overflow-y-auto w-full h-full mx-auto">
                    {isLoaded ?
                        (feedbacks.length !== 0 ? feedbacks.map((match) => (
                            <MatchList match={match}></MatchList>
                        ))
                            : <div class="text-center mx-auto mb-1 mt-10 text-black ">
                                <p class="text-2xl font-bold">{t('nofeedback')}</p>
                                <p class="text-gray-600 mb-3">{t('nofeedbacklong')}</p>
                            </div>)

                        : (<div class="flex btn btn-lg btn-ghost loading mx-auto">loading</div>)
                    }
                </div>
            </FeedbackListWrapper>
        </div>
    );
}

export default FeedbackList;
