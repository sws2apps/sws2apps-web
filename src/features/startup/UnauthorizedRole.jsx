import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import Typography from '@mui/material/Typography';
import { isUnauthorizedRoleState, isUserSignInState } from '../../states/main';

const UnauthorizedRole = () => {
  const setUserSignIn = useSetRecoilState(isUserSignInState);
  const setIsUnauthorizedRole = useSetRecoilState(isUnauthorizedRoleState);

  const handleSignIn = () => {
    setUserSignIn(true);
    setIsUnauthorizedRole(false);
  };

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ReportProblemIcon
          color="error"
          sx={{
            fontSize: '40px',
            cursor: 'pointer',
          }}
        />
        <Typography variant="h5">Unauthorized account</Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: '20px',
          margin: '30px 0',
        }}
      >
        <Typography>
          You do not have yet the required role to use this application. Please contact the site administrator if you
          believe you should have access.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={handleSignIn}>
          OK
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedRole;
