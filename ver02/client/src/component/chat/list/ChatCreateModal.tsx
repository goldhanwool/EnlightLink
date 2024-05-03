import { Box, Button, Modal, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import React, { useState } from "react";
import { useCreateChat } from "../../../hook/useCreateChat";
import { router } from "../../Routes";
import { snackVar } from "../../../constants/snackVar";
import LoadingModal from "../../util/LoadingModal";
import { useUploadFile } from "../../../hook/useUploadFile";
import { useUploadVector } from "../../../hook/useUploadVector";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

export const SmText = styled(Typography)({
    color: 'black',
    fontWeight: 600,
    marginBottom: '20px',
    fontFamily: 'Poppins',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

interface ChatCreateModalProps {
    open: boolean;
    handleClose: () => void;
}

const ChatCreateModal = ({ open, handleClose }: ChatCreateModalProps) => {
    const [loading, setLoading] = useState({ active: false, message: '', processNumber: '0/0' }); // 로딩 상태 관리

    const [createChat] = useCreateChat();  
    const { uploadFile } = useUploadFile();
    const { uploadVector } = useUploadVector();

    const handleFileUpload = async (event: any) => {
        const formData = new FormData();
        formData.append("file", event.target.files[0]);

        try { 
            setLoading({active: true, message: '🦄 Uploading file...', processNumber: '1/3'});
            const awsData = await uploadFile(formData);
      
            setLoading({active: true, message: '🐫 Saving file...', processNumber: '2/3'});
            const vectorData = await uploadVector(formData);
      
            setLoading({ active: true, message: '🐕 Completing task...', processNumber: '3/3' });
            
            //create Chat
            const chatRes = await createChat({ 
              variables: { 
                  createChatInput: { 
                      originFileName: vectorData?.originFileName, 
                      filename: vectorData?.filename, 
                      pineconeNamespace: vectorData?.namespace,
                      pineconeIndex: vectorData?.index,
                      targetId: 'GPT-3.5-turbo-mutdaai01',
                      imageUrl: awsData?.awsUrl
                  } 
              }
            })

            router.navigate(`/chats/${chatRes?.data.createChat._id}`) 
            handleClose()
            setLoading({active: false, message: '', processNumber: '0'});
      
          } catch (error) {
            setLoading({active: false, message: '', processNumber: '0'});
            snackVar({message: '파일 업로드 체크.', type: 'error'})
            throw new Error('Unknown Error')
          }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
        >
            {loading.active ? (
                <LoadingModal open={loading.active} message={loading.message}/>
            ) : (
              <Box
                sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '70%',
                    bgcolor: 'background.paper',
                    border: '1px solid #000',
                    boxShadow: 24,
                    p: 4,
                    justifyContent: 'space-between',
                    height: {
                        sm: '200px', 
                        xs: '220px'
                      },        
                }}
            >   
                <Stack sx={{ marginTop: '20px' }}> 
                    <SmText>Upload your PDF</SmText>
                    <Button 
                        component="label"
                        role={undefined}
                        startIcon={<AddOutlinedIcon sx={{ justifyContent: 'center'}}/>} 
                        sx={{
                            height: '50px',         
                            borderColor: 'black', 
                            color: 'black', 
                            '&:hover': {
                                borderColor: 'white', 
                                backgroundColor: '#F7F7F7',
                                color: '#B2B2B2'
                            } 
                        }}
                        variant='outlined'
                    >
                        <VisuallyHiddenInput 
                            type="file" 
                            accept="application/pdf"
                            onChange={handleFileUpload}
                        />
                    </Button>
                </Stack>
            </Box>
            )}
        </Modal>
    );
}

export default ChatCreateModal;