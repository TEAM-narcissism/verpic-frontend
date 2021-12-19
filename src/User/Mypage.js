import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navigator from "../components/Navigator/Navigator";
import tw from 'twin.macro';
import styled from 'styled-components';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import getuser from "../api/getuser";
import { useTranslation } from 'react-i18next';
import i18next from "i18next";
import { connect } from 'react-redux';

const ProfileWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  margin-top: 100px;
  ${tw`container w-1/2  mx-auto text-black`}
`;

const ProfileText = styled.div`
  font-family: 'NanumGothic-Regular';
  ${tw`mb-5`}
`;

const ReserveListWrapper = styled.div`
  font-family: 'NanumGothic-Regular';
  ${tw`container w-full border bg-white`}
`;


const ProfileAvatar = styled.div`
    width: 70px;
    height: 70px;
  ${tw` border mx-auto my-4 bg-gray-400 rounded-full text-white flex justify-center items-center overflow-hidden
`}
`;



function Mypage({user}) {

  const [isLoading, setIsLoding] = useState(true);
  const [reservationList, setReservationList] = useState([{
    id: "", isSoldOut: "", korTheme: "", engTheme: "", studyDate: ""
  },
  ]);
  const [matchList, setMatchList] = useState();
  const cookies = new Cookies();
  const token = cookies.get('vtoken');
  const { t, i18n } = useTranslation('mypage');

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
    window.open('/videochecking/' + matchId, '_blank')

  }

  useEffect(async () => {

    await axios.get("/api/reservation/user/", {
      headers: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) {
          setReservationList(res.data);
        }
      })
      .catch((
        err => {
          window.location.href = '/logout';
        }
      ))

    await axios.get('/api/matching/login-user/', {
      headers: {
        Authorization: token,
      }
    })
      .then((res) => {
        if (res.data) {
          setMatchList(res.data);
          setIsLoding(false);
        }
      })


  }, []);

  return (
    <div class="container max-w-full h-120vh bg-gray-100">
      <Navigator focus="마이페이지" />
      {isLoading ? <div class="flex btn btn-lg btn-ghost loading mx-auto">{t('isloading')}</div> :
        <>
          <ProfileWrapper>
            <div class=" text-xl font-semibold mb-2">{t('title')}</div>
            <div class="text-center border rounded-lg mb-10 bg-white">
              <ProfileAvatar>
                <span class="text-2xl font-semibold">{user.firstName}</span>
              </ProfileAvatar>


              <ProfileText> {t('name')} <span className="font-semibold">{user.lastName} {user.firstName}</span></ProfileText>
              <ProfileText> {t('email')} <span className="font-semibold">{user.email}</span></ProfileText>
              <ProfileText>
                {t('firstlanguageprefix')}
                <span className="font-semibold">{user.firstLanguage === "KOR" ? t('korean') : t('english')}</span>
                {t('firstlanguagesuffix')}
              </ProfileText>
              <ProfileText>
                {t('learnlanguageprefix')}
                <span className="font-semibold">{user.learnLanguage === "KOR" ? t('korean') : t('english')}</span>
                {t('learnlanguagesuffix')}
              </ProfileText>

            </div>
            <div class=" text-xl font-semibold mb-1">{t('reservationtitle')}</div>
            <div class=" mb-2">
              {t('reservationdescriptionprefix')}
              {user.lastName}{user.firstName}
              {t('reservationdescriptionsuffix')}
            </div>

            <ReserveListWrapper>
              {reservationList.length === 0 ? <div class="text-center p-2">{t('noreservedstudy')}</div> : <></>}

              {reservationList.map((reservation) => (

                <div class="text-center mb-5 mt-5" key={reservation.id}>
                  <div class="font-semibold text-xl">
                    {i18next.language === "kr" ? reservation.topic.korTheme : reservation.topic.engTheme}

                  </div>

                  <div>
                    {reservation.studyDate}
                  </div>

                  {reservation.soldOut ?
                    <>
                      <div>
                        <span>{t('issoldout')}</span>
                        <span>
                          <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 ml-1 mt-1" />
                        </span>
                      </div>

                      <div class="border p-1 rounded-lg w-1/6 my-2 mx-auto cursor-pointer"
                        onClick={() => studyChatLink(reservation.id)}>
                        {t('studyroomlink')}
                      </div>
                    </>
                    :
                    <>
                      <div>{t('notsoldout')}</div>
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

const mapStateToProps = (state) => ({
  user: state.getUsers.user
});
export default connect(mapStateToProps)(Mypage);