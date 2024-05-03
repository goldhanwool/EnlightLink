import { makeVar } from '@apollo/client';
import { AlertColor } from '@mui/material';

interface SnackMessage {
    message: any;
    type: AlertColor;
}

export const snackVar = makeVar<SnackMessage | undefined>(undefined)