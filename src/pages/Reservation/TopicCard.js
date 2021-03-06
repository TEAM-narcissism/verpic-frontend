import React, { useState } from "react";

import i18next from "i18next";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useTranslation } from "react-i18next";

const CardWrapper = styled.div`
  ${tw`w-full overflow-hidden rounded-lg border-2 shadow-sm bg-white cursor-pointer sm:flex mb-10 hover:shadow-lg duration-500`}
`;

const ImageWrapper = styled.div`
  ${tw`w-full sm:w-1/3`}
`;

const TopicImage = styled.img`
  ${tw`object-cover w-full h-60`}
`;

const TopicContentWrapper = styled.div`
  ${tw`px-6 py-4`}
`;

const TopicThemeText = styled.div`
  ${tw`mb-5 mt-5 text-xl font-semibold  tracking-wider text-gray-800`}
`;

const TopicStartTimeText = styled.div`
  ${tw`leading-normal text-gray-700 mb-2`}
`;


function Card({ topic, checkedItemHandler, checkedItem }) {
  const [isSelected, setIsSelected] = useState(false);
  const { t, i18n } = useTranslation("card");

  const onClick = (e) => {
    e.preventDefault();
    setIsSelected(!isSelected);
    checkedItemHandler(topic.id);
  };

  console.log(topic.studyDate);
  let studyDate = new Date(topic.studyDate);
  const studyDateFullString =
    studyDate.getFullYear() +
    "년 " +
    (parseInt(studyDate.getMonth()) + 1) +
    "월 " +
    studyDate.getDate() +
    "일";
  return (
    <CardWrapper
      value={topic.id}
      onClick={onClick}
      className={
        checkedItem === topic.id
          ? "border ring-4 ring-offset-2 ring-indigo-400 px-2 py-4"
          : ""
      }
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
        <div class="font-semibold">{t('starttime')}</div>
        <TopicStartTimeText>
          {i18next.language === "kr" ? studyDateFullString : studyDate.toDateString()}
        </TopicStartTimeText>

        <div class="font-semibold">{t('numofparticipant')}</div>

        <TopicStartTimeText>
          {t("personcounttagprefix")}
          {topic.numOfParticipant}
          {t("personcounttagsuffix")}
        </TopicStartTimeText>
      </TopicContentWrapper>

    </CardWrapper>
  );
}

export default React.memo(Card);

Card.defaultProps = {
  isOnclickActivate: true
};