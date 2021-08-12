import React from 'react';

const CreateChat = ({message, onChange, onCreate}) => {

  const onCheckEnter = (e) => {
    if(e.key === 'Enter') {
      onCreate()
    }
  }

    return (
      <div>
          <input 
            name="message"
            placeholder="메세지를 입력해주세요"
            onChange={onChange}
            value={message}
            onKeyPress={onCheckEnter}
          />
          
          <button onClick={onCreate}>보내기</button>
      </div>  
    );
};

export default React.memo(CreateChat);