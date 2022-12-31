import { useEffect, useRef, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import {
  apiHostState,
  isEmailNotVerifiedState,
  isUserSignInState,
  userEmailState,
  visitorIDState,
} from '../../states/main';

const EmailNotVerified = () => {
  const abortCont = useRef();

  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setEmailNotVerified = useSetRecoilState(isEmailNotVerifiedState);

  const apiHost = useRecoilValue(apiHostState);
  const userEmail = useRecoilValue(userEmailState);
  const visitorID = useRecoilValue(visitorIDState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errTxt, setErrTxt] = useState('');

  const handleSignIn = () => {
    setUserSignIn(true);
    setEmailNotVerified(false);
  };

  const handleResendVerification = async () => {
    try {
      abortCont.current = new AbortController();

      setErrTxt('');
      setIsProcessing(true);

      if (apiHost !== '') {
        const res = await fetch(`${apiHost}api/users/resend-verification`, {
          method: 'GET',
          signal: abortCont.current.signal,
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        const data = await res.json();
        setIsProcessing(false);

        if (res.status !== 200) {
          setErrTxt(data.message);
        }
      }
    } catch (err) {
      if (!abortCont.current.signal.aborted) {
        setIsProcessing(false);
        setErrTxt(err.message);
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
        Email address verification
      </Typography>

      {!isProcessing && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '20px',
            margin: '25px 0',
          }}
        >
          {errTxt.length === 0 && (
            <>
              <CheckCircleIcon
                color="success"
                sx={{
                  fontSize: '80px',
                  cursor: 'pointer',
                }}
              />
              <Typography>
                An email message has been sent you to verify your account. You will not be able to use your account if
                it has not been verified yet. You may need to check the Spam or Junk Email folder. Resend the
                verification message in case you did not received it.
              </Typography>
            </>
          )}
          {errTxt.length > 0 && (
            <>
              <ErrorIcon
                color="error"
                sx={{
                  fontSize: '80px',
                  cursor: 'pointer',
                }}
              />
              <Typography>{`An error occured while sending verification message to your email account: ${errTxt}`}</Typography>
            </>
          )}
        </Box>
      )}

      {isProcessing && (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '15px',
          }}
        >
          <CircularProgress disableShrink color="secondary" size={'70px'} />
        </Container>
      )}

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
        }}
      >
        <Link component="button" underline="none" variant="body1" onClick={handleResendVerification}>
          Resend verification email
        </Link>
        <Link component="button" underline="none" variant="body1" onClick={handleSignIn}>
          Proceed to sign in
        </Link>
      </Box>
    </Container>
  );
};

export default EmailNotVerified;
