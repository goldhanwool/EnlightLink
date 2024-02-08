import React, { useState, useRef } from 'react'
import './Chat.css'
import { data } from '../store';


const ChatMain = () => {
  const [text, setText] = useState('');
  
  const idx = useRef(0); // 메세지 항시 최신화
  
  const [messages, setMessages] = useState(data); // 상태로 관리

  const sendText = () => {
    // const options = { weekday: 'long', hour: '2-digit', minute: '2-digit' };
    // const now = new Date();
    // const dateTimeWithDay = now.toLocaleString('ko-KR', options);
    
    const newMessage = {
      message: text,
      type: 'user',
      time: new Date().toLocaleTimeString().slice(0,5) // 현재 시간으로 설정
      
    };

    setMessages([...messages, newMessage]); // 새 메시지를 대화 목록에 추가
    setText(''); // 입력 필드 초기화  
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 80) { // 최대 80자까지만 허용
      setText(value);
    }
  }
  
  const handleKeyPressed = (e) => {
    if (e.nativeEvent.isComposing) {
      return;
    }

    if (e.code === "Enter" && text.length > 0) {
      sendText();
    }
  };

  return (
      <div className="content">
        <section className="chat_container">
          <div className='chat_container_inner'>    
            {messages?.map((conversation, idx) => (
              conversation.type === 'ai' ? (
              <div key={idx}>
                <div className="messages">
                  <div className="message">
                    <img src="https://randomuser.me/api/portraits/women/85.jpg" alt="Description" />     
                    <p className="ai_text">{conversation.message}</p>
                  </div> 
                  <p className="time">{conversation.time}</p>
                </div>
                <div className="message_term_first"></div>
              </div>  
              ) : (
              <div key={idx}>
                <div className="messages">
                <div className="message text_only">
                  <div className="response">
                      <p className="user_text">{conversation.message}</p>
                  </div>
                </div>
                <p className="response_time time">{conversation.time}</p>
                </div>
                <div className="message_term_second"></div>
              </div>
            )))}
          {/* inputbox */}
          </div>
        </section>
        <div className="footer_chat">
                <div className="input">
                    <input 
                      placeholder="Type your message here!" 
                      type="text" 
                      value={text}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPressed}
                    />
                    {/* <div className="line"></div> */}
                    <button
                      onClick={sendText}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
             </div>
      </div> 
  )
}


export default ChatMain