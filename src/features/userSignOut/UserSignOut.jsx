import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  apiHostState,
  isAppClosingState,
  isOnlineState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  userEmailState,
  visitorIDState,
} from '../../states/main';

const UserSignOut = () => {
  const [open, setOpen] = useRecoilState(isAppClosingState);
  const [userEmail, setUserEmail] = useRecoilState(userEmailState);

  const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    const abortCont = new AbortController();

    const handleLogout = async () => {
      if (isOnline) {
        if (apiHost !== '') {
          await fetch(`${apiHost}api/users/logout`, {
            signal: abortCont.signal,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              visitorid: visitorID,
              email: userEmail,
            },
          });
        }
      }

      localStorage.removeItem('email');

      setOpen(false);
      setUserMfaSetup(false);
      setUserMfaVerify(false);
      setUserSignIn(true);
      setUserEmail('');
    };

    if (open) {
      handleLogout();
    }

    return () => {
      abortCont.abort();
    };
  }, [
    open,
    apiHost,
    isOnline,
    setOpen,
    setUserMfaSetup,
    setUserMfaVerify,
    setUserSignIn,
    setUserEmail,
    userEmail,
    visitorID,
  ]);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-close-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-close-title">Logging out</DialogTitle>
        <DialogContent>
          <CircularProgress
            color="secondary"
            size={80}
            disableShrink={true}
            sx={{
              display: 'flex',
              margin: '10px auto',
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserSignOut;
