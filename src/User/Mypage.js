import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navigator from "../Component/Navigator";
import tw from 'twin.macro';
import styled from 'styled-components';



const ProfileWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  height: 500px;
  ${tw`container w-1/2  mx-auto mt-28`}
`;

const ProfileText = styled.div`
  font-family: 'NanumGothic-Regular';

  ${tw`mb-5`}
`;

const ReserveListWrapper = styled.div`
  font-family: 'NanumGothic-Regular';

  ${tw`container w-full border`}
`;



function Mypage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoding] = useState(true);
  const [reservationList, setReservationList] = useState();



  const { id } = useParams();

  useEffect(async () => {
    await axios.get("/users/" + id)
      .then((res) => {
        if (res.data) {
          console.log(res.data);
          setUser(res.data)

        }
      });

    await axios.get("/reservation/user/" + id)
      .then((res) => {
        if (res.data) {
          setReservationList(res.data);
          console.log(res.data);
          setIsLoding(false);
        }
      })
  }, []);

  return (
    <>


      {isLoading ? <div class="text-center">로딩중이에요...</div> :
        <>
          <Navigator user={user} />

          <ProfileWrapper>
            <div class=" text-xl font-semibold mb-2"> 프로필</div>
            <div class="text-center border rounded-lg mb-10">
              <ProfileText> 이름: {user.firstName}{user.lastName} </ProfileText>
              <ProfileText> 이메일: {user.email}</ProfileText>
              <ProfileText> {user.firstLanguage}가 자신있어요.</ProfileText>
              <ProfileText> {user.learnLanguage}를 배우고 싶어요.</ProfileText>

            </div>
            <div class=" text-xl font-semibold mb-1">스터디 예약 현황</div>
            <div class=" mb-2">{user.firstName}{user.lastName}님이 신청하신 스터디 현황이에요.</div>

            <ReserveListWrapper>
              {reservationList.map((reservation) => (

                <div class="text-center mb-5 mt-5" key={reservation.id}>
                  <div class="font-semibold text-xl">
                    {reservation.topic.theme}
                  </div>

                  <div>
                    {reservation.topic.studyDate}
                  </div>

                  {reservation.soldOut ?
                    <>
                      <div>상대방과의 매칭이 완료되었어요.</div>
                      <div class="border p-1 rounded-lg w-1/6 my-2 mx-auto cursor-pointer">
                        스터디룸 링크
                      </div>
                    </>
                    :
                    <>
                      <div>적절한 상대를 찾고 있어요.</div>
                    </>
                  }

                </div>

              ))}
            </ReserveListWrapper>




          </ProfileWrapper>

        </>
      }
    </>
  );
}

export default Mypage;
