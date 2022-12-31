import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MuiOtpInput } from 'mui-one-time-password-input';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import {
  apiHostState,
  isAdminState,
  isReEnrollMFAState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  qrCodePathState,
  secretTokenPathState,
  userEmailState,
  visitorIDState,
} from '../../states/main';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const VerifyMFA = () => {
  const abortCont = useRef();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [userOTP, setUserOTP] = useState('');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsReEnrollMFA = useSetRecoilState(isReEnrollMFAState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setQrCodePath = useSetRecoilState(qrCodePathState);
  const setSecretTokenPath = useSetRecoilState(secretTokenPathState);
  const setIsAdmin = useSetRecoilState(isAdminState);

  const apiHost = useRecoilValue(apiHostState);
  const userEmail = useRecoilValue(userEmailState);
  const visitorID = useRecoilValue(visitorIDState);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      abortCont.current = new AbortController();

      if (userOTP.length === 6) {
        setIsProcessing(true);
        const reqPayload = {
          token: userOTP,
        };

        if (apiHost !== '') {
          const res = await fetch(`${apiHost}api/mfa/verify-token`, {
            method: 'POST',
            signal: abortCont.current.signal,
            headers: {
              'Content-Type': 'application/json',
              visitorid: visitorID,
              email: userEmail,
            },
            body: JSON.stringify(reqPayload),
          });

          const data = await res.json();
          if (res.status === 200) {
            if (data.global_role === 'admin') {
              localStorage.setItem('email', userEmail);
              setIsAdmin(true);
              navigate('/');
              return;
            }

            setIsProcessing(false);
            setIsUserMfaVerify(false);
            setIsUnauthorizedRole(true);
          } else {
            if (data.message) {
              setIsProcessing(false);
              setAppMessage(data.message);
              setAppSeverity('warning');
              setAppSnackOpen(true);
            } else {
              setSecretTokenPath(data.secret);
              setQrCodePath(data.qrCode);
              setIsReEnrollMFA(true);
              setIsUserMfaSetup(true);
              setIsProcessing(false);
              setIsUserMfaVerify(false);
            }
          }
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
  }, [
    apiHost,
    navigate,
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setIsAdmin,
    setIsReEnrollMFA,
    setIsUnauthorizedRole,
    setIsUserMfaSetup,
    setIsUserMfaVerify,
    setQrCodePath,
    setSecretTokenPath,
    userEmail,
    userOTP,
    visitorID,
  ]);

  useEffect(() => {
    if (userOTP.length === 6) {
      handleVerifyOTP();
    }
  }, [handleVerifyOTP, userOTP]);

  useEffect(() => {
    return () => {
      if (abortCont.current) abortCont.current.abort();
    };
  }, [abortCont]);

  useEffect(() => {
    const handlePaste = (e) => {
      const text = (e.clipboardData || window.clipboardData).getData('text');
      setUserOTP(text);
    };

    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        MFA verification
      </Typography>

      <Box sx={{ width: '100%', maxWidth: '450px', marginTop: '20px' }}>
        <MuiOtpInput
          value={userOTP}
          onChange={handleOtpChange}
          length={6}
          display="flex"
          gap={1}
          validateChar={validateChar}
          TextFieldsProps={{ autoComplete: 'off' }}
        />
      </Box>

      <Box
        sx={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          maxWidth: '450px',
          width: '100%',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <Button
          variant="contained"
          disabled={isProcessing || visitorID.length === 0}
          onClick={handleVerifyOTP}
          endIcon={isProcessing ? <CircularProgress size={25} /> : null}
        >
          Verify
        </Button>
      </Box>
    </Container>
  );
};

export default VerifyMFA;
