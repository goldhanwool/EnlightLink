import { Box, IconButton, Stack, TextField } from "@mui/material";
import ElectricBoltOutlinedIcon from '@mui/icons-material/ElectricBoltOutlined';

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { snackVar } from "../../../constants/snackVar";
import { useCreateMessage } from "../../../hook/useCreateMessage";
import { useMessageCreated } from "../../../hook/useMessageCreated";
import CircularProgress from '@mui/material/CircularProgress';

interface ChatInputProps {
    chatId: string;
  }

const ChatInput = ({ chatId }: ChatInputProps) => {
    const params = useParams();
    const paramChatId = params.id!;

    if (paramChatId !== chatId) {
        snackVar({ message: 'chat Error', type: 'error' });
        new Error('chat Error');
    }

    const [createMessage] = useCreateMessage(chatId);
    const [message, setMessage] = useState('');

    //subscription
    const [loading, setLoading] = useState(false);
    console.log('[[ChatInput]] >  loading: ', loading);

    const { data: subscriptionMessage } = useMessageCreated(chatId);
    console.log('[[Chat]] > latestMessage: ', subscriptionMessage);
  
    useEffect(() => {
        if (subscriptionMessage) {
            setLoading(false);
            
        }
    }, [subscriptionMessage]);

    return (
        <Stack>
            {/* TextInput */}
            <Box sx={{ p: 1, borderTop: '1px solid black', backgroundColor: 'white', display: 'flex'}}>
                {/* Input Field */}
                <Box sx={{ width: '95%' }}>
                <TextField
                    fullWidth
                    multiline
                    placeholder="message..."
                    variant="outlined"
                    minRows={1}
                    maxRows={3} 
                    InputProps={{
                        sx: {
                            height: '4.0rem', 
                            padding: '0px 12px',
                            '& input': {
                                fontSize: '0.9rem', 
                                padding: '0.5px'
                            },
                            width: '100%',
                        },
                    }}
                    sx={{
                        p: 0,
                        '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                        },
                        '& .MuiOutlinedInput-input': {
                        fontSize: '0.75rem',
                        },
                        '& .MuiOutlinedInput-root': {
                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                            },
                        },
                        },
                    }}
                    onChange={(e) => setMessage(e.target.value)}
                    value={message}
                    onKeyDown={async (e) => {
                        if (loading) {
                            snackVar({ message: '현재 통신 중 입니다. 메세지를 발송할 수 없습니다.', type: 'error' });
                            return;
                        }
                        if (message.trim().length <= 0) {
                            setMessage('')
                            return;
                        }
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();  
                            setLoading(true);
                            await createMessage({
                                    variables: {
                                        createMessageInput: {
                                            chatId: chatId,
                                            content: message,
                                            userType: 'USER'
                                        }
                                    }
                                });
                            setMessage('')
                        }
                        }}
                />
                </Box>
                {loading ? (
                    <Box>
                        {/* Input Button */}
                        <CircularProgress 
                            color="inherit" 
                            size={30}
                            sx={{ 
                                marginTop: '0.9rem',
                                marginRight: '0.5rem',
                            }}
                        />
                    </Box>
                    ) : (
                    <Box>
                        {/* Input Button */}
                        <IconButton
                            color="primary"
                            sx={{ 
                                marginTop: '1rem',
                            }}
                            onClick={async() => {
                                try { 
                                    if (message.trim().length <= 0) {
                                        setMessage('')
                                        return;
                                    }
                                    await createMessage({
                                        variables: {
                                            createMessageInput: {
                                                chatId: chatId,
                                                content: message,
                                                userType: 'USER'
                                            }
                                        }
                                    });
                                    setMessage('')
                                } catch (error) { 
                                    snackVar({ message: 'Error sending message', type: 'error' });
                                }
                            }}
                        >
                            <ElectricBoltOutlinedIcon 
                                sx={{ 
                                    color: 'black',
                                    width: '1.2rem',
                                    height: '1.2rem',
                                }}
                            />
                        </IconButton>
                    </Box>
                )}
            </Box>
        </Stack>
    );
}
export default ChatInput;