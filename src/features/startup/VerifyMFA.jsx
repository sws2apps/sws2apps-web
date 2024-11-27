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
  isAdminState,
  isReEnrollMFAState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  visitorIDState,
} from '../../states/main';
import { apiHandleVerifyOTP } from '../../api/auth';

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value) => {
  return matchIsNumeric(value);
};

const VerifyMFA = () => {
  const navigate = useNavigate();

  const cancel = useRef();

  const [isProcessing, setIsProcessing] = useState(false);
  const [userOTP, setUserOTP] = useState('');

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsUserMfaVerify = useSetRecoilState(isUserMfaVerifyState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsReEnrollMFA = useSetRecoilState(isReEnrollMFAState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setIsAdmin = useSetRecoilState(isAdminState);

  const visitorID = useRecoilValue(visitorIDState);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  const handleVerifyOTP = useCallback(async () => {
    try {
      setIsProcessing(true);
      cancel.current = false;

      const response = await apiHandleVerifyOTP(userOTP, false);

      if (!cancel.current) {
        if (response.isSuccess) {
          setIsAdmin(true);
          navigate('/');
        }

        if (response.unauthorized) {
          setIsUserMfaVerify(false);
          setIsUnauthorizedRole(true);
        }

        if (response.reenroll) {
          setIsReEnrollMFA(true);
          setIsUserMfaSetup(true);
          setIsUserMfaVerify(false);
        }

        setIsProcessing(false);
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  }, [
    navigate,
    setAppMessage,
    setAppSeverity,
    setAppSnackOpen,
    setIsAdmin,
    setIsReEnrollMFA,
    setIsUnauthorizedRole,
    setIsUserMfaSetup,
    setIsUserMfaVerify,
    userOTP,
  ]);

  useEffect(() => {
    if (userOTP.length === 6) {
      handleVerifyOTP();
    }
  }, [handleVerifyOTP, userOTP]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

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
        Let’s make sure that it is you
      </Typography>

      <Typography sx={{ marginBottom: '15px' }}>Enter below a code from the authenticator app</Typography>

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
