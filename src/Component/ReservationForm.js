import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import axios from 'axios'

function ReservationForm() {

    const ReservationWrapper = styled.div`
    position: absolute;
    display: flex;
    width: 560px;
    height: 280px;
    justify-content: space-between;
    /* align-items: center; */
    padding: 30px 16px;
    ${tw`max-w-full bg-white rounded-lg shadow-lg`}
  `;

    const [Mothertongue, SetMothertongue] = useState("KOR");
    const [Studylanguage, SetStudylanguage] = useState("ENG");
    const [Proficiency, SetProficiency] = useState("INTERMEDIATE");
    const [Studytime, SetStudytime] = useState("17");

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

    const studytimeHandler = (e) => {
        e.preventDefault();
        SetStudytime(e.target.value);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        // state에 저장한 값을 가져옵니다.

        if (Mothertongue === Studylanguage) {
            alert("Choose again");
            return;
        }

        console.log(Mothertongue);
        console.log(Studylanguage);
        console.log(Proficiency);
        console.log(Studytime);

        let body = {
            userId: 4,
            familiarLanguage: Mothertongue,
            unfamiliarLanguage: Studylanguage,
            userLevel: Proficiency,
            topicId: 2,
            startTime: Studytime,
            isSoldOut: false
        };

        axios
            .post("http://localhost:3000/reservation", body)
            .then((res) => console.log(res));
    };

    return (
        <>
            <ReservationWrapper>
                <form id="form" action="/reservation"
                    method="post" style={{ display: "flex", flexDirection: "Column" }}
                    onSubmit={submitHandler}>
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
}

export default ReservationForm;