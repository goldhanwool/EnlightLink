import React, { useState, useRef, useEffect } from 'react'
import './Chat.css'
import { data } from '../store';
import axios from 'axios';

const Chat = (props) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState(data); // 상태로 관리
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const endOfMessagesRef = useRef(null);
  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages])

  const sendText = async() => {
    if (!props.messages || props.messages.length === 0) {
      console.error("No messages available in props.messages");
      alert("pdf 정보가 없습니다."); // 사용자에게 에러 알림
      setText(''); // 입력 필드 초기화
      return; 
    }
    
    setIsLoading(true);
    const humanMessage = {
      message: text,
      type: 'user',
      time: new Date().toLocaleTimeString().slice(0,5) // 현재 시간으로 설정
    };

    setMessages(messages => [...messages, humanMessage]);


    try {
      const url = 'http://localhost:8000/api/llm/answer'
    
      const dataToSend = {
        question: text,
        vectordb_path: props.messages[0].vectordb_path, 
        session_id: props.messages[0].session_id,
      }

      const res = await axios.post(url, JSON.stringify(dataToSend), {
          headers: {
              'Content-Type': 'application/json'
          }
      }).then((res) => {
          console.log(res.data.answer);
          const answer = res.data.answer;
          const aiMessage = {
            message: answer,
            type: 'ai',
            time: new Date().toLocaleTimeString().slice(0,5)
          }
          setMessages(messages => [...messages, aiMessage]);
          
      })
      .catch((error) => console.log("error:", error))

    } catch (error) {
      console.error("query 실패", error);
      alert("질의 실패");
    }

     // 새 메시지를 대화 목록에 추가
    setText(''); // 입력 필드 초기화  
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 80) { // 최대 80자까지만 허용
      setText(value);
    }
  }
  
  const handleKeyPressed = (e) => {
    if (!props.messages || props.messages.length === 0) {
      console.error("No messages available in props.messages");
      setText(''); // 입력 필드 초기화
      return; 
    }

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
          <div ref={endOfMessagesRef} />
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
                      disabled={isLoading}
                    />
                    {/* <div className="line"></div> */}
                    <button
                      onClick={sendText}
                      disabled={isLoading}
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


export default Chat