import React from "react";
import styled from "@emotion/styled";
import tw from "twin.macro";

const InputStyle = styled.input`
  font-family: "NanumGothic-Regular";
  ${tw`w-full bg-gray-300 py-2 text-sm px-3 rounded-lg`}
`;

const ButtonStyle = styled.button`
  ${tw`bg-yellow-400 text-white text-sm p-1 ml-2 rounded-lg w-1/6 h-full`}
`;

const CreateChat = ({ message, onChange, onCreate }) => {
  const onCheckEnter = (e) => {
    if (e.key === "Enter") {
      onCreate();
    }
  };

  return (
    <div class="flex mb-2 mx-2">
      <InputStyle
        name={"message"}
        placeholder={"메세지를 입력해주세요..."}
        autoComplete={"off"}
        onChange={onChange}
        value={message}
        onKeyPress={onCheckEnter}
      />

      <ButtonStyle onClick={onCreate}>전송</ButtonStyle>
    </div>
  );
};

export default React.memo(CreateChat);
