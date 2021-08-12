import React from 'react';

import tw from 'twin.macro';
import styled from '@emotion/styled';

const InputStyle = styled.input`
  ${tw`w-full bg-gray-300 py-2 px-3 rounded-xl`}`;
  
const ButtonStyle = styled.button`
  
  ${tw`bg-blue-500 ml-2 rounded-xl w-1/12 h-full`}`;

const CreateChat = ({message, onChange, onCreate}) => {

  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      onCreate()
    }
  }

    return (
      <div class='flex mb-2 mx-2'>
        <InputStyle 
          name={"message"}
          placeholder={"메세지를 입력해주세요"}
          autoComplete={"off"}
          onChange={onChange}
          value={message}
          onKeyPress={onCheckEnter}
        />
        <inputStyle></inputStyle>

        <ButtonStyle onClick={onCreate}>전송</ButtonStyle>
      </div>
    );
};

export default React.memo(CreateChat);