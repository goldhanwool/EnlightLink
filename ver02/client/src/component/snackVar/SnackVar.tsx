import * as React from 'react';
import Button from '@mui/material/Button';
import { Snackbar as MUISnackbar } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useReactiveVar } from '@apollo/client';
import { snackVar } from '../../constants/snackVar';


export const SimpleSnackbar = () => {
  const snack = useReactiveVar(snackVar);

  const handleClose = (
    event: React.SyntheticEvent | Event, 
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    snackVar(undefined);
  };
  
  const action = (
    <React.Fragment>
      <Button color="inherit" size="small" onClick={handleClose}>
      </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="secondary"
          onClick={handleClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
    </React.Fragment>
  );

  return (
    <>
    {snack && (
        <div>
          <MUISnackbar
            open={snack !== undefined}
            autoHideDuration={2000}
            onClose={handleClose}
            message={snack.message}
            action={action}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            sx={{
                backgroundColor: snack.type === 'success' ? '#4caf50' : snack.type === 'error' ? '#f44336' : snack.type === 'info' ? '#2196f3' : '#ff9800',
                color: '#fff',
            }}
          />
        </div>
      )
    }
    </>
  );
}
