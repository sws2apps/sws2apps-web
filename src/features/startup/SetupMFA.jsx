import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { MuiOtpInput } from 'mui-one-time-password-input';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TabPanel from '../../components/TabPanel';
import {
  apiHostState,
  isAdminState,
  isReEnrollMFAState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  qrCodePathState,
  secretTokenPathState,
  userEmailState,
  visitorIDState,
} from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const a11yProps = (index) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const matchIsNumeric = (text) => {
  return !isNaN(Number(text));
};

const validateChar = (value, index) => {
  return matchIsNumeric(value);
};

const SetupMFA = () => {
  const abortCont = useRef();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [userOTP, setUserOTP] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [isNoQR, setIsNoQR] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsUserMfaSetup = useSetRecoilState(isUserMfaSetupState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);
  const setIsAdmin = useSetRecoilState(isAdminState);

  const apiHost = useRecoilValue(apiHostState);
  const qrCodePath = useRecoilValue(qrCodePathState);
  const token = useRecoilValue(secretTokenPathState);
  const userEmail = useRecoilValue(userEmailState);
  const visitorID = useRecoilValue(visitorIDState);
  const isReEnrollMFA = useRecoilValue(isReEnrollMFAState);

  const handleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleCopyClipboard = async (text) => {
    await navigator.clipboard.writeText(text);
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
            // congregation not assigned
            setIsProcessing(false);
            setIsUserMfaSetup(false);
            setIsUnauthorizedRole(true);
          } else {
            setIsProcessing(false);
            setAppMessage(data.message);
            setAppSeverity('warning');
            setAppSnackOpen(true);
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
    setIsUnauthorizedRole,
    setIsUserMfaSetup,
    userEmail,
    userOTP,
    visitorID,
  ]);

  const handleOtpChange = async (newValue) => {
    setUserOTP(newValue);
  };

  useEffect(() => {
    if (userOTP.length === 6) {
      handleVerifyOTP();
    }
  }, [handleVerifyOTP, userOTP]);

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

  useEffect(() => {
    const getQrCode = async () => {
      QRCode.toDataURL(qrCodePath, function (err, data_url) {
        if (err) {
          return;
        }

        setImgPath(data_url);
      });
    };

    if (qrCodePath.length > 0) {
      getQrCode();
    }
  }, [qrCodePath]);

  useEffect(() => {
    return () => {
      if (abortCont.current) abortCont.current.abort();
    };
  }, [abortCont]);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        Setup Multi-factor Authentication (MFA)
      </Typography>

      <Typography
        sx={{
          margin: '20px 0',
        }}
      >
        {isReEnrollMFA
          ? '<strong>Important:</strong> We have updated the MFA verification system. First, delete the previous sws2apps account created on Microsoft Authenticator or Google Authenticator. Then, choose on which device do you want to finalize the setup of the new verification code.'
          : 'Two-factor authentication from the program Microsoft Authenticator or Google Authenticator is required. Then choose on which device do you want to do the setup'}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="This device" {...a11yProps(0)} />
          <Tab label="Other device" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Typography sx={{ marginBottom: '15px' }}>
          You may continue the setup when one of the two programs above has been installed on your device.
        </Typography>
        <Button variant="contained" target="_blank" rel="noopener" href={qrCodePath}>
          Setup
        </Button>
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        {isNoQR && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-end',
              marginBottom: '10px',
            }}
          >
            <TextField
              id="outlined-token"
              label="Token"
              variant="outlined"
              autoComplete="off"
              value={token}
              multiline
              sx={{ width: '100%', maxWidth: '500px', marginTop: '10px' }}
              InputProps={{
                readOnly: true,
              }}
            />
            <IconButton aria-label="copy" onClick={() => handleCopyClipboard(token)}>
              <ContentCopyIcon />
            </IconButton>
          </Box>
        )}

        {!isNoQR && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {imgPath.length > 0 && <img className="qrcode" src={imgPath} alt="QR Code 2FA" />}
          </Box>
        )}

        <Link component="button" underline="none" variant="body1" onClick={() => setIsNoQR(!isNoQR)}>
          {isNoQR ? 'Scan QR Code instead' : 'I cannot scan this QR Code'}
        </Link>
      </TabPanel>

      <Typography sx={{ marginBottom: '15px', marginTop: '20px' }}>
        Then, enter below the OTP code generated from the app
      </Typography>

      <Box sx={{ width: '300px' }}>
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
          flexDirection: 'column',
          alignItems: 'flex-start',
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

export default SetupMFA;
