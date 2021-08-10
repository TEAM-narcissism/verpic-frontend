import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';
import axios from 'axios'


function ReservationForm() {
    
    const ReservationWrapper = styled.div`

        ${tw`container mx-10 mb-10`}
  `;

    const ReservationQuestionWrapper = styled.div`

        ${tw `border rounded shadow-lg p-10`}
    `;

    const ResevationText = styled.div`

        ${tw `text-3xl font-bold mb-1`}
    `;

    const ReservationOptionText = styled.div`
        ${tw`font-semibold text-xl `}
    `;
    const ReservationOptionWrapper = styled.div`
        ${tw`mx-auto mb-10`}
    `;

    const ReservationOptionSelect = styled.select`
        ${tw`ml-10 border p-3 rounded mt-4`}
    `;




    const ReservationSendButton = styled.button`
        ${tw`border w-full rounded-lg p-3  bg-gray-400 text-white font-bold`}
    `;

    const [Mothertongue, SetMothertongue] = useState("");
    const [Studylanguage, SetStudylanguage] = useState("");
    const [Proficiency, SetProficiency] = useState("");
    const [Studytime, SetStudytime] = useState("");

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
        console.log(Mothertongue);
        console.log(Studylanguage);
        console.log(Proficiency);
        console.log(Studytime);

        let body = {
            userId: 3,
            familiarLanguage: Mothertongue,
            unfamiliarLanguage: Studylanguage,
            userLevel: Proficiency,
            topicId: 1,
            startTime: Studytime,
            isSoldOut: true
        };

        axios
            .post("http://localhost:3000/reservation", body)
            .then((res) => console.log(res));
    };

    return (
    
            <ReservationWrapper>
            <ResevationText>스터디 신청</ResevationText>


            <div class="text-gray-600 mb-3">간단한 답변만 해주시면 돼요.</div>

            <ReservationQuestionWrapper>
              <ReservationOptionWrapper>

                <ReservationOptionText className="mb-10">
                    <span class="mr-3">Step1.</span>원하는 토픽을 먼저 골라주세요.
                </ReservationOptionText>
                <ReservationOptionText>
                    <span class="mr-3">Step2.</span>모국어를 선택해주세요.
                </ReservationOptionText>
                    <ReservationOptionSelect name="mothertongue" value={Mothertongue} onChange={mothertongueHandler}>
                        <option value="KOR">korean</option>
                        <option value="ENG">english</option>
                    </ReservationOptionSelect>
              </ReservationOptionWrapper>

              <ReservationOptionWrapper>
                <ReservationOptionText>
                <span class="mr-3">Step3.</span>어떤 언어를 공부하실건가요?
                </ReservationOptionText>
                    <ReservationOptionSelect name="studylanguage" value={Studylanguage} onChange={studylanguageHandler}>
                        <option value="KOR">korean</option>
                        <option value="ENG">english</option>
                    </ReservationOptionSelect>
              </ReservationOptionWrapper>

              <ReservationOptionWrapper>
                <ReservationOptionText>
                    <span class="mr-3">Step4.</span>간략한 언어 수준을 말해주세요.
                </ReservationOptionText>
                    <ReservationOptionSelect name="proficiency" value={Proficiency} onChange={proficiencyHandler}>
                        <option value="BEGINNER">beginner</option>
                        <option value="INTERMEDIATE">intermediate</option>
                        <option value="ADVANCED">advanced</option>
                    </ReservationOptionSelect>
              </ReservationOptionWrapper>

              <ReservationOptionWrapper>
                <ReservationOptionText>
                <span class="mr-3">Step5.</span>어떤 시간대에 참여하실래요?
                </ReservationOptionText>
                    <ReservationOptionSelect name="studytime" value={Studytime} onChange={studytimeHandler}>
                        <option value="17">17시</option>
                        <option value="18">18시</option>
                        <option value="19">19시</option>
                    </ReservationOptionSelect>
              </ReservationOptionWrapper>
                <ReservationSendButton onClick={submitHandler}>스터디 신청</ReservationSendButton>
          
          </ReservationQuestionWrapper>
            </ReservationWrapper>
    
    );
}

export default ReservationForm;