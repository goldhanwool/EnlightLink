import React, { useState } from 'react';
import { Modal, Backdrop, CircularProgress, Box, Typography } from '@mui/material';
import styled from '@emotion/styled';

export const LoadingText = styled(Typography)({
    color: 'white',
    fontWeight: 500,
    marginBottom: '20px',
    fontFamily: 'Poppins',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

interface LoadingModalProps {
    open: boolean;
    message: string;
}

const LoadingModal = ({ open, message }: LoadingModalProps)=> {
    return (
        <>
        <Modal
            open={open}
            closeAfterTransition
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(200, 200, 200, 0.1)',
            }}
        >
            <Box sx={{ 
                // width: '50%', 
                // height: '50%', 
                // bgcolor: 'background.paper', 
                // boxShadow: 24, 
                // p: 4, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                // opacity: 0,
            }}>
                <LoadingText>{message}</LoadingText>
                <CircularProgress color="success" />
            </Box>
        </Modal>
        </>
    );
}

export default LoadingModal;