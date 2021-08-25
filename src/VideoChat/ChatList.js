import React, { useEffect, useRef, useState } from "react";

import styled from "@emotion/styled";
import tw from "twin.macro";

const ChatWrapper = styled.div`
  ${tw`mx-2 py-1 px-4 bg-gray-400 text-sm rounded-br-3xl font-semibold rounded-tr-3xl rounded-tl-xl`}
`;

const MyChatWrapper = styled.div`
  ${tw`mx-2 py-1 px-4 bg-indigo-300 text-sm rounded-bl-3xl font-semibold rounded-tl-3xl rounded-tr-xl `}
`;

const NoticeWrapper = styled.p`
  ${tw`mx-1 py-1 px-4 rounded-3xl bg-yellow-200 whitespace-pre-wrap`};
`;

const Chat = React.memo(function Chat({ chat, myId, succesive }) {
  if (myId === chat.userId) {
    return (
      <div>
        {succesive ? null : <span class="flex justify-end mr-2 text-gray-100 text-sm">{chat.sender}</span>}
        <div class="flex justify-end mb-1">
          <div class="text-right">
            <MyChatWrapper>{chat.message}</MyChatWrapper>
          </div>
        </div>
      </div>
    );
  }
  else if (0 === chat.userId) {
    return (
    <div>
      {succesive ? null : <span class="flex justify-center mr-2 text-gray-100 text-sm font-semibold">{chat.sender}</span>}
        <div class="flex justify-center mb-1">
          <div class="text-left">
            <NoticeWrapper>{chat.message}</NoticeWrapper>
          </div>
        </div>
    </div>
    );
  } 
  else {
  }
  return (
    <div>
      {succesive ? null : <span class="flex justify-start ml-2 text-gray-100 text-sm ">{chat.sender}</span>}
      <div class="flex justify-start mb-1">
        <div class="text-right">
          <ChatWrapper>{chat.message}</ChatWrapper>
        </div>
      </div>
    </div>
  );
});

const ChatListWrapper = styled.div`
  &::-webkit-scrollbar {
    width: 4px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
  }
  ${tw`flex flex-col mt-2 overflow-y-auto gap-1 w-full`}
`;



function ChatList({ chats, myId }) {
  const scrollRef = useRef(null);
  const before = useRef(-1);
  const [succesive, setSeccesive] = useState([
    false
  ],)
  useEffect(() => {

    const scroll = scrollRef.current.scrollHeight - scrollRef.current.clientHeight;
    scrollRef.current.scrollTo(0, scroll);
    console.log("ggggg", before.current, chats.length)
    while (before.current < chats.length) {
      if (before.current > 0) {
        if (chats[before.current] && chats[before.current].userId === chats[before.current - 1].userId) {
          setSeccesive(succesive => succesive.concat(true))
        }
        else {
          setSeccesive(succesive => succesive.concat(false))
        }
        before.current += 1;
      }
      else {
        before.current += 1;
      }
    }
    
    
  }, [chats]);
  
  return (
    <ChatListWrapper ref={scrollRef}>
      {chats ? chats.map((chat) => (
        <Chat chat={chat} myId={myId} key={chat.id} succesive={succesive[chat.id - 1] ? succesive[chat.id - 1] : false}/>
      )) : null}
      <div ></div>
    </ChatListWrapper>
  );
}

export default React.memo(ChatList);
