import React from 'react'

const Chat = React.memo(function Chat({ chat }) {
    return (
        <div class='col-6'>
            <div class='alert alert-secondary'>
                <b>{chat.sender} : {chat.message} </b>
            </div>
        </div>
    );
});



function ChatList({ chats }) {
    return (
        <div>
            {chats.map(chat => (
                <Chat chat={chat} key={chat.id} />
            ))}
        </div>
    );
}

export default React.memo(ChatList);