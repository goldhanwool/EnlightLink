import React, { useEffect, useState } from 'react';
import { Typography, styled, Stack, Button } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { useNavigate } from 'react-router-dom';
import { snackVar } from '../../constants/snackVar';
import { useCreateChat } from '../../hook/useCreateChat';
import LinearProgress from '@mui/material/LinearProgress';
import { useGetUsers } from '../../hook/useGetUsers';
import { useCreateUser } from '../../hook/useCreateUser';
import { useUploadFile } from '../../hook/useUploadFile';
import { useUploadVector } from '../../hook/useUploadVector';
import client from '../../constants/apollo-client';

export const Text = styled(Typography)({
  color: 'black',
  fontWeight: 600,
  marginBottom: '25px',
  fontFamily: 'Poppins',
  fontSize: '30px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const LoadingText = styled(Typography)({
  color: 'black',
  fontWeight: 500,
  marginBottom: '12px',
  fontFamily: 'Poppins',
  fontSize: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

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
  border: '0.5px solid black',
});

const Upload = () => {
  const [loading, setLoading] = useState({ active: false, message: '', processNumber: '0/0' }); // 로딩 상태 관리
  const [ createChat ] = useCreateChat();
  const { createUser } = useCreateUser();
  const { uploadFile } = useUploadFile();
  const { uploadVector } = useUploadVector();
  const { data } = useGetUsers();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
        navigate('/');
    }
  }, [data, navigate])

  const handleFileUpload = async (event: any) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    try { 
      setLoading({active: true, message: '🦧 Creating account...', processNumber: '1/4'});
      await createUser();

      setLoading({active: true, message: '🦄 Uploading file...', processNumber: '2/4'});
      const awsData = await uploadFile(formData);

      setLoading({active: true, message: '🐫 Saving file...', processNumber: '3/4'});
      const vectorData = await uploadVector(formData);

      setLoading({ active: true, message: '🐕 Completing task...', processNumber: '4/4' });
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
      await client.refetchQueries({ include: "active" });
      snackVar({ message: 'Welcome 🌝', type: 'success' })
      setLoading({active: false, message: '', processNumber: '0'});
      navigate(`/chats/${chatRes?.data.createChat._id}`) 
    } catch (error: any) {
      setLoading({active: false, message: '', processNumber: '0'});
      snackVar({message: '파일 업로드 체크.', type: 'error'})
      throw new Error(error)
    }
  }
  return (
    <>
    {loading.active ? ( 
      <Stack 
        spacing={3}
        sx={{height: '80vh', maxWidth: '50%', margin: 'auto', justifyContent: 'center'}}
      >    
        <LoadingText>{loading.message}</LoadingText>
        <LinearProgress color='inherit'/> 
      </Stack>
    ) : (
    <Stack 
      spacing={3}
      sx={{height: '80vh', maxWidth: '50%', margin: 'auto', justifyContent: 'center'}}
    >            
      <Text>Please upload your PDF</Text> 
      <Button 
          component="label"
          role={undefined}
          sx={{
              padding: '10px 20px', 
              borderBottom: '3px solid black', 
              borderRight: '3px solid black', 
              display: 'flex',
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
          onClick={() => {}}
      >
          <AddOutlinedIcon sx={{ justifyContent: 'center'}}/>
          <VisuallyHiddenInput 
              type="file" 
              accept="application/pdf"
              onChange={handleFileUpload}
          />
        </Button>
    </Stack>
    )}
    </> 
  ); // end of return
}
export default Upload;
