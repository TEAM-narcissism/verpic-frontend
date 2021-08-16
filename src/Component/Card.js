import styled from '@emotion/styled';
import React, { useState, useEffect } from 'react';
import tw from 'twin.macro';



const CardWrapper = styled.div`
  ${tw` mx-10 overflow-hidden rounded-lg border shadow-sm cursor-pointer sm:flex mb-10 hover:shadow-lg duration-500`}
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
  ${tw`mb-3 text-xl font-semibold tracking-tight text-gray-800`}
`;

const TopicStartTimeText = styled.div`
  ${tw`leading-normal text-gray-700 mb-5`}
`;


const PersonCountTag = styled.div`
  ${tw`inline-block bg-gray-200 rounded-full px-3 py-1 font-semibold text-gray-700 mr-2`}
`;

const PreviewButton = styled.button`
  ${tw`w-full sm:w-1/3 border text-green-400 bg-blue-200 text-4xl`}
`

function Card({ topic, checkedItemHandler, checkedItem, isPreviewButton }) {
  const [isSelected, setIsSelected] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    setIsSelected(!isSelected);
    checkedItemHandler(topic.id);
  }

  return (

    <CardWrapper value={topic.id} onClick={onClick} className={checkedItem === topic.id ? "ring-2 ring-yellow-400 px-2 py-6" : ""} >


      <ImageWrapper>
        <TopicImage src={"data:image/png;base64," + topic.data} alt="Flower and sky" />
      </ImageWrapper>

      <TopicContentWrapper>
        <TopicThemeText>{topic.theme}</TopicThemeText>
        <TopicStartTimeText>Study starts at {topic.studyDate}</TopicStartTimeText>
        <PersonCountTag>총 {topic.numOfParticipant}명이 참여중이에요</PersonCountTag>
      </TopicContentWrapper>

      {
        isPreviewButton ? <PreviewButton onClick={() => window.location.href = "/"}>Go to Preview!</PreviewButton> : ""
      }

    </CardWrapper>
  )
}




export default React.memo(Card);