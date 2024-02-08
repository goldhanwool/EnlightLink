import React from 'react'
import './Chat.css'

const Test = () => {
  return (
      <div className="content">
        <section className="chat_container">
          <div className='chat_container_inner'>
            <div className="messages">
            {/* aI 메세지 */}
              <div className="message">
                <img src="https://randomuser.me/api/portraits/men/85.jpg" alt="Description" />     
                 <p className="ai_text">안녕하시오</p>
              </div> 
              <div className="message text-only">
                <p className="ai_text">CORS(Cross-Origin Resource Sharing) 문제: 클라이언트와 서버가 다른 도메인에서 실행되고 있다면, CORS 정책 때문에 연결이 거부될 수 있습니다. 서버 측에서 적절한 CORS 설정을 해야 합니다.</p>
              </div>
              <p className="time"> 14h58</p>
            </div>
            {/* 인간 메세지 */}
            <div className="message text_only">
              <div className="response">
                  <p className="user_text">이 HTML 파일은 서버에 연결하고, 'message' 이벤트를 통해 서버로 메시지를 보내며, 서버로부터 'reply' 이벤트를 받아 콘솔에 출력합니다.</p>
              </div>
            </div>
            <p className="response_time time"> 15h04</p>
      
            <div className="message_term_first"></div>
            {/* aI 메세지 */}
            <div className="message">
                <img src="https://randomuser.me/api/portraits/women/63.jpg" alt="Description" />     
                  <p className="ai_text">방화벽 또는 네트워크 문제: 서버 또는 클라이언트의 네트워크에 방화벽이나 기타 네트워크 제한이 WebSocket 연결을 차단하고 있을 수 있습니다.</p>
            </div>
            <div className="message text-only">
                <p className="ai_text">서버 측 소켓 버전 불일치: 클라이언트와 서버 간의 Socket.IO 버전이 맞지 않을 경우, 연결이 실패할 수 있습니다.</p>
            </div>
            <p className="time">14h58</p>
              
            {/* 인간 메세지 */}
            <div className="message text_only">
                <div className="response">
                    <p className="user_text">이 HTML 파일은 서버에 연결하고, 'message' 이벤트를 통해 서버로 메시지를 보내며, 서버로부터 'reply' 이벤트를 받아 콘솔에 출력합니다.</p>
                </div>
            </div>
            <p className="response_time time"> 15h04</p>
            
            <div className="message_term_first"></div>
            
            <div className="message">
                <img src="https://randomuser.me/api/portraits/women/97.jpg" alt="Description"/>     
                  <p className="ai_text">SSL/TLS 인증서가 올바르게 설치되고 유효한지 확인하세요.</p>
            </div>
            <p className="time">14h58</p>
            </div>
            
            {/* inputbox */}
            
            <div className="footer_chat">
                <div className="input">
                    <input placeholder="Type your message here!" type="text" />
                    <div className="line"></div>
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
             </div>
        </section>
        </div>
      
  )
}

export default Test