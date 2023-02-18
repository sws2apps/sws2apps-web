import { getAuth, indexedDBLocalPersistence, setPersistence, signInWithPopup, signOut, unlink } from 'firebase/auth';
import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';

const OAuthButtonBase = ({ buttonStyles, logo, text, provider, isEmail }) => {
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const handleOAuthAction = async () => {
    try {
      const auth = getAuth();
      await setPersistence(auth, indexedDBLocalPersistence);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const findPasswordProvider = user.providerData.find((provider) => provider.providerId === 'password');

      if (user.providerData.length === 2) {
        if (findPasswordProvider) {
          await unlink(auth.currentUser, 'password');
          return;
        }

        await unlink(auth.currentUser, provider.providerId);
        await signOut(auth);
      }
    } catch (error) {
      setAppMessage(`An error occured: ${error.code}: ${error.message}`);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  return (
    <Button
      variant="contained"
      sx={{ ...buttonStyles, height: '41px', padding: 0, width: '320px', justifyContent: 'flex-start' }}
      onClick={handleOAuthAction}
    >
      <Box sx={{ width: '50px', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px',
            marginLeft: '1px',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img alt="Microsoft Icon" src={logo} style={{ width: '18px', height: '18px' }} />
        </Box>
      </Box>
      <Typography sx={{ textTransform: 'none' }}>{text}</Typography>
    </Button>
  );
};

export default OAuthButtonBase;
