import React, { useState } from "react";

import i18next from "i18next";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

const CardWrapper = styled.div`
  ${tw`mx-10 overflow-hidden rounded-lg border-2 shadow-sm bg-white sm:flex mb-10 hover:shadow-lg duration-500`}
`;

const ImageWrapper = styled.div`
  ${tw`w-1/2 sm:w-1/3`}
`;

const TopicImage = styled.img`
  ${tw`object-cover w-full h-60`}
`;

const TopicContentWrapper = styled.div`
  ${tw`px-6 py-4 w-full`}
`;

const TopicThemeText = styled.div`
  ${tw`mb-5 mt-2 text-xl font-semibold  tracking-wider text-gray-800`}
`;

const TopicStartTimeText = styled.div`
  ${tw`leading-normal text-gray-700 mb-2`}
`;



const PreviewButton = styled.div`
    background: #25292e;
    font-family: 'NanumGothic-Regular';
  ${tw`absolute w-full right-0 top-0 sm:w-1/3 border m-2 text-center font-semibold text-white p-1 text-sm rounded-lg cursor-pointer`}
`;

const StudyRoomButton = styled.div`

    font-family: 'NanumGothic-Regular';
  ${tw`absolute w-full right-0 top-20 sm:w-1/3 border m-2 text-center font-semibold text-black p-1 text-sm rounded-lg cursor-pointer`}
`;


function ReservationCard({ topic, reservation, matchList }) {
    const [isSelected, setIsSelected] = useState(false);
    const { t, i18n } = useTranslation("card");


    let studyDate = new Date(topic.studyDate);
    const studyDateFullString =
        studyDate.getFullYear() +
        "년 " +
        (parseInt(studyDate.getMonth()) + 1) +
        "월 " +
        studyDate.getDate() +
        "일 " +
        reservation.startTime +
        "시";

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



    return (
        <CardWrapper
            value={reservation.id}

        >
            <ImageWrapper>
                <TopicImage
                    src={"data:image/png;base64," + topic.data}
                    alt="Flower and sky"
                />
            </ImageWrapper>

            <TopicContentWrapper>
                <TopicThemeText>
                    {i18next.language === "kr" ? topic.korTheme : topic.engTheme}
                </TopicThemeText>
                <div class="font-semibold">개최</div>
                <TopicStartTimeText>
                    {i18next.language === "kr" ? studyDateFullString : studyDate.toDateString()}
                </TopicStartTimeText>

                <div class="font-semibold">확정여부</div>

                <TopicStartTimeText>

                    {reservation.soldOut ?
                        <>
                            <div class="flex">
                                <span>상대방과의 매칭이 완료됐어요.</span>
                                <span>
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 w-5 ml-1 mt-1" />
                                </span>
                            </div>

                        </>
                        :
                        <div>적절한 상대를 찾고 있어요.</div>

                    }
                </TopicStartTimeText>
            </TopicContentWrapper>

            <div class="relative w-full flex-col">
                <PreviewButton
                    onClick={() => (window.location.href = "/preview/" + topic.id)}
                >
                    {t("previewbutton")}
                </PreviewButton>
                {reservation.soldOut ?
                    <StudyRoomButton
                        onClick={() => studyChatLink(reservation.id)}
                    >
                        스터디룸 링크
                    </StudyRoomButton> : <></>
                }
            </div>

        </CardWrapper>
    );
}

export default React.memo(ReservationCard);

ReservationCard.defaultProps = {
    isOnclickActivate: true
};