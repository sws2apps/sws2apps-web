import Box from '@mui/material/Box';
import OAuthGitHub from './OAuthGitHub';
import OAuthGoogle from './OAuthGoogle';
import OAuthMicrosoft from './OAuthMicrosoft';
import OAuthYahoo from './OAuthYahoo';

const OAuth = () => {
  return (
    <Box sx={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
      <OAuthGoogle />
      <OAuthGitHub />
      <OAuthYahoo />
      <OAuthMicrosoft />
    </Box>
  );
};

export default OAuth;
