import React, { useState } from "react";

import i18next from "i18next";
import styled from "@emotion/styled";
import tw from "twin.macro";
import { useTranslation } from "react-i18next";

const CardWrapper = styled.div`
  ${tw` mx-10 overflow-hidden rounded-lg border-2 shadow-sm bg-white cursor-pointer sm:flex mb-10 hover:shadow-lg duration-500`}
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

const PersonCountTag = styled.div`
  ${tw`inline-block bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-2`}
`;

const StartTimeTag = styled.div`
  ${tw`inline-block bg-gray-200 rounded-full px-2 py-1 font-semibold text-sm text-gray-700 mr-2 mb-5`}
`;

const PreviewButton = styled.button`
    font-family: 'NanumGothic-ExtraBold';
  ${tw`w-1/6 h-1/2 sm:w-1/3 border text-black bg-gray-100 m-3 p-1 text-lg rounded-lg`}
`;

function Card({ topic, checkedItemHandler, checkedItem, isPreviewButton, isOnclickActivate }) {
  const [isSelected, setIsSelected] = useState(false);
  const { t, i18n } = useTranslation("card");

  const onClick = (e) => {
    e.preventDefault();
    setIsSelected(!isSelected);
    checkedItemHandler(topic.id);
  };
  const onClickNothing = (e) => {

  };

  let studyDate = new Date(topic.studyDate);
  const studyDateFullString =
    studyDate.getFullYear() +
    "년 " +
    studyDate.getMonth() +
    "월 " +
    studyDate.getDay() +
    "일";
  return (
    <CardWrapper
      value={topic.id}
      onClick={isOnclickActivate ? onClick : onClickNothing}
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
        <div class="font-semibold">개최</div>
        <TopicStartTimeText>
          {i18next.language === "kr" ? studyDateFullString : studyDate.toDateString()}
        </TopicStartTimeText>

        <div class="font-semibold">인원</div>

        <TopicStartTimeText>
          {t("personcounttagprefix")}
          {topic.numOfParticipant}
          {t("personcounttagsuffix")}
        </TopicStartTimeText>
      </TopicContentWrapper>
      {isPreviewButton ? (
        <PreviewButton
          onClick={() => (window.location.href = "/preview/" + topic.id)}
        >
          {t("previewbutton")}
        </PreviewButton>
      ) : (
        ""
      )}
    </CardWrapper>
  );
}

export default React.memo(Card);

Card.defaultProps = {
  isOnclickActivate: true
};