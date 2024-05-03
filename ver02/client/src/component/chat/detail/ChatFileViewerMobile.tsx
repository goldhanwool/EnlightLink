import { Box, Stack } from '@mui/material'

interface ChatFileViewerProps {
    imageUrl: string | undefined;
  }
  
const ChatFileViewerMobile = ({imageUrl}: ChatFileViewerProps) => {
  return (
    <>
    {/* PdfViewer */} 
    <Stack sx={{width: '100%', borderRight: '1px solid black' }}>
        <Box sx={{ height: '100vh', width: '100%'}}>
            {imageUrl ? (
              <object data={imageUrl} width="100%" height="100%"></object>
            ):(
              <Box>Url이 없습니다</Box>
            )}
        </Box>
    </Stack>
    </>
  )
}

export default ChatFileViewerMobile;