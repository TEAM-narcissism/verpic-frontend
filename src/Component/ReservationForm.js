import React, { useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios'
import CardList from './CardList';

const ReservationForm = React.memo(() => {

    const ReservationWrapper = styled.div`
    position: absolute;
    display: flex;
    width: 560px;
    height: 280px;
    justify-content: space-between;
    padding: 30px 16px;
  `;

    const [Mothertongue, SetMothertongue] = useState("KOR");
    const [Studylanguage, SetStudylanguage] = useState("ENG");
    const [Proficiency, SetProficiency] = useState("INTERMEDIATE");
    const [Topicid, SetTopicid] = useState("");
    const [Studytime, SetStudytime] = useState("17");

    const resertAll = (e) => {
        e.preventDefault();
        SetMothertongue("KOR");
        SetStudylanguage("ENG");
        SetProficiency("INTERMEDIATE");
        SetTopicid("");
        SetStudytime("17");
    }

    const mothertongueHandler = (e) => {
        e.preventDefault();
        SetMothertongue(e.target.value);
    };

    const studylanguageHandler = (e) => {
        e.preventDefault();
        SetStudylanguage(e.target.value);
    };

    const proficiencyHandler = (e) => {
        e.preventDefault();
        SetProficiency(e.target.value);
    };

    const topicidHandler = (e) => {
        e.preventDefault();
        SetTopicid(e.target.value);
    };

    const studytimeHandler = (e) => {
        e.preventDefault();
        SetStudytime(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        // state에 저장한 값을 가져옵니다.

        if (Mothertongue === Studylanguage) {
            alert("You choose same languages. Choose again!");
            return;
        }
        else if (Topicid === "") {
            alert("Choose topic!");
            return;
        }

        console.log(Mothertongue);
        console.log(Studylanguage);
        console.log(Proficiency);
        console.log(Topicid);
        console.log(Studytime);

        let body = {
            userId: 5,
            familiarLanguage: Mothertongue,
            unfamiliarLanguage: Studylanguage,
            userLevel: Proficiency,
            topicId: Topicid,
            startTime: Studytime,
            isSoldOut: false
        };

        axios
            .post("http://localhost:3000/reservation", body)
            .then((res) => console.log(res)).then(() => alert("예약 완료~"));
    };

    return (
        <>
            <ReservationWrapper>
                <form id="form" action="/reservation" onSubmit={submitHandler}
                    method="post" style={{ display: "flex", flexDirection: "Column" }}
                >

                    <CardList onChange={topicidHandler} resetAll={resertAll} />

                    <label>Mother Tongue</label>
                    <select name="mothertongue" value={Mothertongue}
                        onChange={mothertongueHandler}>
                        <option value="KOR">korean</option>
                        <option value="ENG">english</option>
                    </select>

                    <label>Study Language</label>
                    <select name="studylanguage" value={Studylanguage}
                        onChange={studylanguageHandler}>
                        <option value="KOR">korean</option>
                        <option value="ENG">english</option>
                    </select>

                    <label>Your Level</label>
                    <select name="proficiency" value={Proficiency}
                        onChange={proficiencyHandler}>
                        <option value="BEGINNER">beginner</option>
                        <option value="INTERMEDIATE">intermediate</option>
                        <option value="ADVANCED">advanced</option>
                    </select>

                    <label>Study Start Time</label>
                    <select name="studytime" value={Studytime}
                        onChange={studytimeHandler}>
                        <option value="17">17</option>
                        <option value="18">18</option>
                        <option value="19">19</option>
                    </select>
                    <button type="submit">submit</button>
                </form>
            </ReservationWrapper>
        </>
    );
});

export default ReservationForm;