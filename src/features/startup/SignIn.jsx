import { useEffect, useRef } from 'react';
import { Markup } from 'interweave';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import OAuth from './OAuth';

const SignIn = () => {
  const cancel = useRef();

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Container sx={{ marginTop: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        Sign in
      </Typography>

      <Typography sx={{ marginBottom: '20px' }}>
        <Markup content="Choose below which service you want to use for sign in.<br><strong>Please note that you may not have access to this website.</strong>" />
      </Typography>

      <OAuth />
    </Container>
  );
};

export default SignIn;
