import React, { useState } from 'react';
import tw from 'twin.macro';
import styled from '@emotion/styled';

const VideoWrapper = styled.div`
  ${tw`text-center`}
`;


const StudyStartText = styled.text`
    height: 20px;
  ${tw`text-xl text-center mt-10 p-3 text-gray-700`}
`;


const UserVideo = styled.video`
    height: 400px;   
    ${tw` hover: bg-gray-200 cursor-pointer border rounded-lg mx-10 my-10`}
`;

const ChatView = styled.div`
    height: 400px;
    ${tw` hover: bg-gray-200 cursor-pointer border rounded-lg mx-10 my-10`}
`;



function VideoPlayer() {
  const [navbarOpen, setNavbarOpen] = React.useState(false);
  return (
    <VideoWrapper>
        <StudyStartText>스터디가 진행중이에요.</StudyStartText>

      

        <div class="flex-row justify-content-around mb-3 mt-5">
            <div>
            <UserVideo id="local_video" autoPlay playsInline>gg</UserVideo>
            <UserVideo id="remote_video" autoPlay playsInline>gg</UserVideo>
            </div>
            <span>
                <ChatView></ChatView>

            </span>
        </div>
    </VideoWrapper>
  );
}
export default VideoPlayer;