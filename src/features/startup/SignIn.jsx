import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { isEmailValid } from '../../utils/emailValid';
import {
  apiHostState,
  isEmailNotVerifiedState,
  isOnlineState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
  qrCodePathState,
  secretTokenPathState,
  userEmailState,
  userPasswordState,
  visitorIDState,
} from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const SignIn = () => {
  const abortCont = useRef();

  const setUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);
  const setUserEmail = useSetRecoilState(userEmailState);
  const setUserPassword = useSetRecoilState(userPasswordState);
  const setQrCodePath = useSetRecoilState(qrCodePathState);
  const setSecretTokenPath = useSetRecoilState(secretTokenPathState);

  const visitorID = useRecoilValue(visitorIDState);
  const apiHost = useRecoilValue(apiHostState);
  const isOnline = useRecoilValue(isOnlineState);

  const [userTmpPwd, setUserTmpPwd] = useState('');
  const [userTmpEmail, setUserTmpEmail] = useState('');
  const [hasErrorEmail, setHasErrorEmail] = useState(false);
  const [hasErrorPwd, setHasErrorPwd] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const togglePwd = () => {
    setShowPwd((prev) => {
      return !prev;
    });
  };

  const handleSignIn = async () => {
    try {
      abortCont.current = new AbortController();

      setHasErrorEmail(false);
      setHasErrorPwd(false);
      if (isEmailValid(userTmpEmail) && userTmpPwd.length >= 10) {
        setIsProcessing(true);

        const reqPayload = {
          email: userTmpEmail,
          password: userTmpPwd,
          visitorid: visitorID,
        };

        if (apiHost !== '') {
          const res = await fetch(`${apiHost}user-login`, {
            method: 'POST',
            signal: abortCont.current.signal,
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(reqPayload),
          });

          const data = await res.json();
          if (res.status === 200) {
            setUserEmail(userTmpEmail);
            localStorage.setItem('email', userTmpEmail);
            setUserPassword(userTmpPwd);
            setIsProcessing(false);
            setUserMfaVerify(true);
            setUserSignIn(false);
          } else {
            if (data.secret && data.qrCode) {
              setUserEmail(userTmpEmail);
              localStorage.setItem('email', userTmpEmail);
              setUserPassword(userTmpPwd);
              setIsProcessing(false);
              setSecretTokenPath(data.secret);
              setQrCodePath(data.qrCode);
              setUserMfaSetup(true);
              setUserSignIn(false);
            } else if (data.message === 'NOT_VERIFIED') {
              setUserEmail(userTmpEmail);
              localStorage.setItem('email', userTmpEmail);
              setIsProcessing(false);
              setEmailNotVerified(true);
              setUserSignIn(false);
            } else {
              setIsProcessing(false);
              setAppMessage(data.message);
              setAppSeverity('warning');
              setAppSnackOpen(true);
            }
          }
        }
      } else {
        if (!isEmailValid(userTmpEmail)) {
          setHasErrorEmail(true);
        }
        if (userTmpPwd.length < 10) {
          setHasErrorPwd(true);
        }
      }
    } catch (err) {
      if (!abortCont.current.signal.aborted) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (abortCont.current) abortCont.current.abort();
    };
  }, [abortCont]);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        Sign in
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>
        Sign in to your account. An internet connection is required.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', maxWidth: '500px' }}>
        <TextField
          sx={{ marginTop: '20px', width: '100%' }}
          id="outlined-email"
          label="Email address"
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpEmail}
          onChange={(e) => setUserTmpEmail(e.target.value)}
          error={hasErrorEmail ? true : false}
        />

        <TextField
          sx={{ marginTop: '20px', width: '100%' }}
          id="outlined-password"
          label="Password"
          type={showPwd ? '' : 'password'}
          variant="outlined"
          autoComplete="off"
          required
          value={userTmpPwd}
          onChange={(e) => setUserTmpPwd(e.target.value)}
          error={hasErrorPwd ? true : false}
        />

        <FormControlLabel
          control={<Checkbox id="checkShowPwd" checked={showPwd} onChange={togglePwd} />}
          label={<Typography sx={{ lineHeight: 1.2 }}>Show password</Typography>}
          sx={{
            width: '100%',
            marginTop: '15px',
          }}
        />
      </Box>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '500px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Button
          variant="contained"
          disabled={!isOnline || isProcessing || visitorID.length === 0}
          onClick={handleSignIn}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          Sign in
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;
