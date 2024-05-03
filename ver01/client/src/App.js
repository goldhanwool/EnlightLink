import './App.css';
import Chat from './Chat/Chat';
// import Test from './test';
import { data } from './store';
import PdfViewer from './Pdf/PdfViewer';
import React, { useState } from 'react';

function App() {
  const [messages, setMessages] = useState([]);
  console.log("App Props: ", messages);
  const addMessageFromPdf = (pdfData) => { 
    // Axios 응답 데이터를 바탕으로 메시지 객체 생성
    const newMessage = {
      session_id: pdfData.session_id, 
      vectordb_path: pdfData.vectordb_path, 
      type: 'pdf', 
      time: new Date().toLocaleTimeString().slice(0,5),
    };
    setMessages([...messages, newMessage]);
  
  };
  
  return (
  <div className="">
    <div className="container" id="container">

        <PdfViewer addMessageFromPdf={addMessageFromPdf}/>
        <Chat messages={messages} />
      </div>
  </div>
  );
}

export default App;
