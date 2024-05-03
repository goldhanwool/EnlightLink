import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";
import { Chat } from "./ChatList";
import { router } from "../../Routes";

interface ChatListItemProps {
    chat: Chat;
    selected: boolean;
}

const ChatListItem = ({ chat, selected }: ChatListItemProps) => {
    return(
        <ListItem
            key={chat._id} 
            sx={{ borderBottom: '1px solid black', height: '65px' }} 
            disablePadding
        >
        <ListItemButton 
                sx={{
                    p: 1,
                    width: '100%',
                }}
                onClick={() => router.navigate(`/chats/${chat._id}`)}
                selected={selected}
            >  
            <ListItemAvatar sx={{ display: { xs: 'none', sm: 'none', md: 'flex'}}}>
                <Avatar 
                    alt="픽사베이 이미지" 
                    src="https://rag-pdf-bk.s3.ap-northeast-2.amazonaws.com/constantImg/painter-4856002_1280.jpg" 
                    sx={{ ml: 1, mr: 2 }} 
                />
            </ListItemAvatar>
            <ListItemText>
                <Typography 
                    aria-label={chat.originFileName}
                    sx={{ 
                        display: 'inline', 
                        component:"span", 
                        fontSize: '0.8rem', 
                        color:"black",
                        overflow: 'hidden', 
                        whiteSpace: 'nowrap', 
                        textOverflow: 'ellipsis', 
                    }}
                >
                {chat.originFileName}
                </Typography>
                <Typography sx={{ fontSize: '0.7rem', color: 'gray' }}>
                    {chat.createdAt.toString().substring(0, 10)}
                </Typography>
            </ListItemText>
        </ListItemButton>
        </ListItem>

    );
}

export default ChatListItem; 