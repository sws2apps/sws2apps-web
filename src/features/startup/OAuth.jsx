import Box from '@mui/material/Box';
import OAuthGoogle from './OAuthGoogle';
import OAuthYahoo from './OAuthYahoo';

const OAuth = () => {
  return (
    <Box sx={{ margin: '10px 0', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '15px' }}>
      <OAuthGoogle />
      <OAuthYahoo />
    </Box>
  );
};

export default OAuth;
