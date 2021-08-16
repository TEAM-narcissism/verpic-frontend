import React, { useEffect, useRef } from "react";

import styled from "@emotion/styled";
import tw from "twin.macro";

const ChatWrapper = styled.div`
  ${tw`ml-2 py-1 px-4 bg-gray-200 text-sm rounded-br-3xl rounded-tr-3xl rounded-tl-xl`}
`;

const MyChatWrapper = styled.div`
  ${tw`mr-2 py-1 px-4 bg-indigo-300 text-sm rounded-bl-3xl rounded-tl-3xl rounded-tr-xl `}
`;

const Chat = React.memo(function Chat({ chat, myName }) {
  if (myName === chat.sender) {
    return (
      <div>
        <span class="flex justify-end mr-2 text-sm font-semibold">
          {chat.sender}
        </span>
        <div class="flex justify-end mb-3">
          <div class="text-right">
            <MyChatWrapper>{chat.message}</MyChatWrapper>
          </div>
        </div>
      </div>
    );
  } else {
  }
  return (
    <div>
      <span class="flex justify-start ml-2 text-sm font-semibold">
        {chat.sender}
      </span>
      <div class="flex justify-start mb-3">
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
  ${tw`flex flex-col mt-2 overflow-y-auto gap-1`}
`;

function ChatList({ chats, myName }) {
  const divRref = useRef(null);
  useEffect(() => {
    divRref.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chats]);

  return (
    <ChatListWrapper>
      {chats.map((chat) => (
        <Chat chat={chat} myName={myName} key={chat.id} />
      ))}
      <div ref={divRref}></div>
    </ChatListWrapper>
  );
}

export default React.memo(ChatList);
