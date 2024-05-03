import { Box, IconButton, Typography } from "@mui/material";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';

interface ChatListHeaderProps {
    setChatModalOpen: (isOpen: boolean) => void;
}

const ChatListHeader = ({setChatModalOpen}: ChatListHeaderProps) => {
    return (
        <Box sx={{ borderBottom: '1px solid black', maxHeight: '20px', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography 
            sx={{ fontSize: '0.7rem', marginTop: '5px', fontWeight: 'bold'}}
        >
        CHAT
        </Typography>
        <IconButton 
            sx={{ ml: 'auto' }}
            onClick={() => setChatModalOpen(true)}
        >
            <AddOutlinedIcon 
                sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'black' }}
            />
        </IconButton>
    </Box>
    );
};
export default ChatListHeader;
