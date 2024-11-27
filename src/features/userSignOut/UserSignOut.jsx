import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getAuth, signOut } from 'firebase/auth';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  apiHostState,
  isAdminState,
  isAppClosingState,
  isOnlineState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  visitorIDState,
} from '../../states/main';

const UserSignOut = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useRecoilState(isAppClosingState);

  const setIsAdmin = useSetRecoilState(isAdminState);
  const setIsUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);

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
    const handleLogout = async () => {
      if (isOnline && apiHost !== '') {
        const auth = await getAuth();
        const user = auth.currentUser;

        await signOut(auth);

        await fetch(`${apiHost}api/v2/users/logout`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'admin',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        setIsAdmin(false);
        setIsUserMfaVerify(false);
        setIsUserMfaSetup(false);
        setIsUserSignIn(true);
        navigate('/signin');
        setOpen(false);
      }
    };

    if (open) {
      handleLogout();
    }
  }, [open, apiHost, isOnline, setIsAdmin, setOpen, visitorID, navigate, setIsUserMfaVerify, setIsUserMfaSetup, setIsUserSignIn]);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-close-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-close-title'>Logging out</DialogTitle>
        <DialogContent>
          <CircularProgress
            color='secondary'
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
