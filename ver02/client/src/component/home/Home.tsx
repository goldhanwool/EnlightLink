import { Typography, styled, Button, Stack  } from '@mui/material';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { snackVar } from "../../constants/snackVar";
import { useState } from "react";
import { router } from "../Routes";
import { useCreateChat } from "../../hook/useCreateChat";
import LoadingModal from '../util/LoadingModal';
import MakePdf from '../util/MakePdf';
import { useUploadFile } from '../../hook/useUploadFile';
import { useUploadVector } from '../../hook/useUploadVector';

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

const Home = () => {
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
          setLoading({active: false, message: '', processNumber: '0'});
    
        } catch (error) {
          setLoading({active: false, message: '', processNumber: '0'});
          snackVar({message: '파일 업로드 체크.', type: 'error'})
          throw new Error('Unknown Error')
        }
    }

    return ( 
    <>
    {loading.active ? ( 
      <LoadingModal open={loading.active} message={loading.message}/>
    ) : (
     <Stack 
      sx={{
        height: '100vh', 
        width: '100%', 
        margin: 'auto', 
        justifyContent: 'center',
        border: '1px solid black', 
        alignItems: 'center',
    }}
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
              width: '50px',         
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
); //end of return
}


export default Home;