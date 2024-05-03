import { Box, Drawer, IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from "react";
import { router } from "../../Routes";
import { useRemoveChat } from "../../../hook/useRemoveChat";
import ChatList from "../list/ChatList";
import { useGetChat } from "../../../hook/useGetChat";
import ChatFileViewerMobile from "./ChatFileViewerMobile";

import styled from "@emotion/styled";

interface ChatHeaderProps {
    chatId: string;
}

export const SmallText = styled(Typography)({
    color: 'black',
    fontWeight: 600,
    fontFamily: 'Poppins',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const ChatHeader = ({ chatId } : ChatHeaderProps) => {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const { data } = useGetChat(chatId);

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };  
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const [removeChat] = useRemoveChat(chatId);
    
    const handleRemoveChat = async () => {
        try {
            await removeChat({
                variables: { chatId }
            });
            handleCloseUserMenu();
            router.navigate(`/`)
        } catch (err) {
            console.error("Error removing chat:", err);
        }
    };

    const toggleDrawer = (newOpen: boolean) => () => {
      setOpen(newOpen);
    };

    const toggleDrawerFile = (newOpen: boolean) => () => {
        setFileOpen(newOpen);
      };
    const [open, setOpen] = useState(false);
    const [fileOpen, setFileOpen] = useState(false);

    return (
        <Stack 
           sx={{ height: '52px', display: 'flex', alignItems: 'flex-end', borderBottom: '1px solid black', backgroundColor: 'white'}}
        >
            {/* chatHeader */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', width: '100%'}}>
                {/* response header */}
                <Box sx={{ display: { sm: 'none', md: 'none', xl: 'none', marginLeft: '10px', marginTop: '2px'}}}>
                    <IconButton onClick={toggleDrawer(true)}>
                        <img src="https://rag-pdf-bk.s3.ap-northeast-2.amazonaws.com/constantImg/b+chat.svg" alt="Custom Icon" style={{ width: 20, height: 20 }} />
                    </IconButton>
                </Box>
                <Drawer 
                    open={open} 
                    onClose={toggleDrawer(false)}
                    sx={{
                        '& .MuiPaper-root': {
                          width: '60%', 
                        }
                      }}
                >
                  <ChatList />
                </Drawer>
                <Box sx={{ display: { sm: 'none', md: 'none', xl: 'none', marginTop: '2px' }}}>
                    <IconButton onClick={toggleDrawerFile(true)}>
                        <img src="https://rag-pdf-bk.s3.ap-northeast-2.amazonaws.com/constantImg/Out.svg" alt="Custom Icon" style={{ width: 20, height: 20 }} />
                    </IconButton>
                </Box>
                <Drawer 
                    open={fileOpen} 
                    onClose={toggleDrawerFile(false)}
                    sx={{
                        '& .MuiPaper-root': {
                          width: '100%',
                          overflow: 'hidden'
                        }
                      }}
                >
                  <Box sx={{ p:0.5, width: '100%', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid grey'}}>  
                    <SmallText>{data?.chat.originFileName}</SmallText>
                    <IconButton onClick={toggleDrawerFile(false)}>
                        <img src="https://rag-pdf-bk.s3.ap-northeast-2.amazonaws.com/constantImg/Add.svg" alt="Custom Icon" style={{ width: 24, height: 24 }} />
                    </IconButton>
                  </Box>
                  <ChatFileViewerMobile imageUrl={data?.chat.imageUrl} />
                </Drawer>
                <Box sx={{ ml: 'auto' }}>
                    <IconButton  onClick={handleOpenUserMenu}>
                        <MoreHorizIcon />
                    </IconButton>
                </Box>
                <Menu
                    sx={{ 
                        mt: '10px'
                    }} 
                    id="menu-appbar" 
                    anchorEl={anchorElUser} 
                    anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                    keepMounted 
                    transformOrigin={{vertical: 'top', horizontal: 'right'}}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem 
                        key='Delete Chat' 
                        onClick={handleRemoveChat}
                        sx={{ 
                            color: 'black',
                        }}
                    >
                        <Typography 
                            textAlign="center" 
                            sx={{
                                fontFamily: 'Poppins',
                                fontSize: '14px',
                                fontWeight: 500,
                            }}
                        >
                            Remove Chat
                        </Typography>
                    </MenuItem>
                </Menu>
            </Box>  
        </Stack>
    );
};

export default ChatHeader;