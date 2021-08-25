import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navigator from "../Common/Navigator";
import tw from 'twin.macro';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import getuser from "../Api/getuser";


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

  ${tw`container w-full border bg-white`}
`;


export const ProfileAvatar = styled.div`
  ${tw`h-12 w-12 border bg-gradient-to-r from-indigo-700 to-green-500 rounded-full text-white flex justify-center items-center overflow-hidden
`}
`;



function Mypage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoding] = useState(true);
  const [reservationList, setReservationList] = useState([{
    id: "", isSoldOut: "", korTheme: "", engTheme: "", studyDate: ""
  },
  ]);
  const [matchList, setMatchList] = useState();
  const cookies = new Cookies();
  const token = cookies.get('vtoken');


  const { id } = useParams();

  const studyChatLink = async (reservationId) => {
    let matchId;
    console.log(reservationId);

    await matchList.map(match => {
      console.log('matchId:' + match.studyReservationResponseDto.id);
      if (match.studyReservationResponseDto.id === reservationId) {
        console.log(match.id);
        matchId = match.id;
      }
    })

    window.open('/studychat/' + matchId, '_blank')

  }

  useEffect(async () => {
    await getuser()
      .then((res) => {
        if (res) {
          console.log(res);
          setUser(res)

          if (res.id != id) {
            window.location.href = '/';
          }

        }
      });

    await axios.get("/reservation/user/", {
      headers: {
        Authorization: token,
      }
    })
      .then((res) => {
        // console.log(res);
        if (res.data) {
          setReservationList(res.data);
          console.log(res.data);
          setIsLoding(false);
        }
      })
      .catch((
        err => {
          window.location.href = '/logout';
        }
      ))

    await axios.get('/matching/user/' + id)
      .then((res) => {
        if (res.data) {
          setMatchList(res.data);
          console.log(res.data);
          setIsLoding(false);
        }
      })


  }, []);

  return (
    <div class="container max-w-full h-100vh bg-gray-100">


      {isLoading ? <div class="text-center">로딩중이에요...</div> :
        <>
          <Navigator user={user} focus="마이페이지" />

          <ProfileWrapper>
            <div class=" text-xl font-semibold mb-2"> 프로필</div>
            <div class="text-center border rounded-lg mb-10 bg-white">
              <ProfileAvatar>
                <span class="text-sm font-semibold">{user.firstName}</span>
              </ProfileAvatar>


              <ProfileText> 이름: {user.firstName}{user.lastName} </ProfileText>
              <ProfileText> 이메일: {user.email}</ProfileText>
              <ProfileText> {user.firstLanguage}가 자신있어요.</ProfileText>
              <ProfileText> {user.learnLanguage}를 배우고 싶어요.</ProfileText>

            </div>
            <div class=" text-xl font-semibold mb-1">스터디 예약 현황</div>
            <div class=" mb-2">{user.firstName}{user.lastName}님이 신청하신 스터디 현황이에요.</div>

            <ReserveListWrapper>
              {reservationList.length === 0 ? <div class="text-center p-2">예약한 스터디가 없어요.</div> : <></>}

              {reservationList.map((reservation) => (

                <div class="text-center mb-5 mt-5" key={reservation.id}>
                  <div class="font-semibold text-xl">
                    {reservation.topic.korTheme}
                  </div>

                  <div>
                    {reservation.studyDate}
                  </div>

                  {reservation.soldOut ?
                    <>
                      <div>
                        <span>상대방과의 매칭이 완료되었어요.</span>
                        <span>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 ml-1 mt-1" />
                        </span>
                      </div>

                      <div class="border p-1 rounded-lg w-1/6 my-2 mx-auto cursor-pointer"
                        onClick={() => studyChatLink(reservation.id)}>
                        스터디룸 링크
                      </div>
                    </>
                    :
                    <>
                      <div>적절한 상대를 찾고 있어요.</div>
                    </>
                  }

                </div>

              )
              )}
            </ReserveListWrapper>




          </ProfileWrapper>

        </>
      }
    </div>
  );
}

export default Mypage;
