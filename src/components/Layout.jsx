import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import RootModal from './RootModal';
import NavBar from './NavBar';
import { UserSignOut } from '../features/userSignOut';
import { isAppClosingState } from '../states/main';

const WaitingPage = () => {
  return (
    <CircularProgress
      color="primary"
      size={80}
      disableShrink={true}
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        margin: 'auto',
      }}
    />
  );
};

const Layout = () => {
  const isAppClosing = useRecoilValue(isAppClosingState);

  return (
    <RootModal>
      <NavBar />
      <Box sx={{ padding: '10px' }}>
        {isAppClosing && <UserSignOut />}

        <Suspense fallback={<WaitingPage />}>
          <Outlet />
        </Suspense>
      </Box>
    </RootModal>
  );
};

export default Layout;
