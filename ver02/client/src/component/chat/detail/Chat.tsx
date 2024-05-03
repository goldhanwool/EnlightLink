import { Avatar, Box, Stack, Typography } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import ChatInput from './ChatInput';
import { useGetChat } from '../../../hook/useGetChat';
import { useGetMessage } from '../../../hook/useGetMessage';
import ChatFileViewer from './ChatFileViewer';


const Chat = () => {
  const params = useParams();
  const chatId: string = params.id!;
  const { data: chatObj } = useGetChat(chatId);

  const { data: messagesObj } = useGetMessage(chatId);

  const divRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    divRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  useEffect(() => {
    scrollToBottom();
  }, [messagesObj?.messages.length])

  return (
    <>
    <Stack 
     direction="row"
     sx={{ width: '100%', height: '100vh', border: '1px solid black', borderLeft: 'none', justifyContent: 'space-between', display: 'flex'}}
    >
        <ChatFileViewer imageUrl={chatObj?.chat.imageUrl} />    
        <Stack sx={{ width: '100%' }}>
            {/* ChatHeader */}
            <ChatHeader chatId={chatId} />
            <Box sx={{ height: '100%', overflow: 'auto' }}>
            {messagesObj?.messages.map((message: any, index: any) => (
                <React.Fragment key={index}>
                    {message.userType === 'AI' ? (
                        <Stack 
                            direction="row" 
                            spacing={2} 
                            sx={{ p:1.5, mb: 0, alignItems: 'top', maxWidth: '85%'}}  
                        >
                            <Avatar 
                                src="https://rag-pdf-bk.s3.ap-northeast-2.amazonaws.com/constantImg/painter-4856002_1280.jpg" 
                                sx={{ width: '25px', height: '25px'}} 
                            />
                            {/* Message */}
                            <Typography sx={{ bgcolor: 'grey.100', p: 1.5, borderRadius: 2, fontSize: '0.7rem'}}>
                                {message.content}
                            </Typography>
                        </Stack>
                    ) : message.userType === 'USER' ? (                   
                        <Stack 
                            direction="row" 
                            justifyContent="flex-end" 
                            spacing={2} 
                            sx={{ p:1, marginLeft: 'auto', alignItems: 'center', maxWidth: '80%', mb: 0}}
                        >
                            {/* Response Message */}
                            <Typography sx={{ p: 1.5, borderRadius: 2, fontSize: '0.7rem', borderColor: 'grey.200', borderWidth: 1, borderStyle: 'solid'}}>
                                {message.content}
                            </Typography>
                        </Stack>
                    ) : null}
                </React.Fragment>
            ))}
            <div ref={divRef}></div>
            </Box>
            {/* ChatInput */}
            <ChatInput chatId={chatId} />
        </Stack>
    </Stack>
    </>
); //end of return
};

export default Chat;
