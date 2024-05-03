import React, { useEffect, useState } from 'react';
import { Box, Grid, Stack } from '@mui/material';
import ChatCreateModal from './ChatCreateModal';
import ChatListHeader from './ChatListHeader';
import ChatListItem from './ChatListItem';

import { useGetChatList } from '../../../hook/useGetChatList';
import { usePath } from '../../../hook/usePath'
import Home from '../../home/Home';

export type Chat = {
    _id: string;
    filename: string;
    originFileName: string;
    userId?: string;
    createdAt: string;
};

const ChatList = () => {
  const { data: chatList } = useGetChatList();
  const [selectedChatId, setSelectedChatId] = useState('');
  const { path } = usePath();
  const [chatModalOpen, setChatModalOpen] = useState(false);

  useEffect(() => {
    const pathSplit = path.split("chats/");

    if (pathSplit.length === 2) {
      setSelectedChatId(pathSplit[1]);
    }
  }, [path])
  
  return (
    <>
      <ChatCreateModal
            open={chatModalOpen}
            handleClose={() => setChatModalOpen(false)}
      />
      {selectedChatId === '' ? (
        <>
        <Grid container>
          <Grid item xs={12} sm={2} md={2} xl={2}>
            <Stack sx={{ width: '100%', height: '100vh', border: '1px solid black'}}>
              <ChatListHeader setChatModalOpen={setChatModalOpen} />
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                  {chatList?.chats.map((chat: Chat) => (
                      <ChatListItem 
                          key={chat._id} 
                          chat={chat} 
                          selected={chat._id === selectedChatId}
                      />
                      )).reverse()}  
              </Box>
            </Stack>
          </Grid>
          <Grid item xs={0} sm={10} md={10} xl={10} sx={{display: { xs: 'none', sm: 'flex' }}}>
                    <Home />
          </Grid>
        </Grid>
        </>
      ) : (
        <Stack sx={{ width: '100%', height: '100vh', border: '1px solid black'}} >
          <ChatListHeader setChatModalOpen={setChatModalOpen} />
          <Box sx={{ height: '100%', overflow: 'auto' }}>
              {chatList?.chats.map((chat: Chat) => (
                  <ChatListItem 
                      key={chat._id} 
                      chat={chat} 
                      selected={chat._id === selectedChatId}
                  />
                  )).reverse()}  
          </Box>
        </Stack>
      )}
    </>
  );
};

export default ChatList;
