import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CongregationMemberRole } from '../congregations';
import UserCongregationRemove from './UserCongregationRemove';

const UserCongregation = ({ user }) => {
  const [tmpUser, setTmpUser] = useState(user);

  useEffect(() => {
    setTmpUser(user);
  }, [user]);

  return (
    <Box sx={{ borderBottom: '1px outset', paddingBottom: '10px' }}>
      <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Congregation Information</Typography>
      <Box sx={{ marginTop: '10px', padding: '10px 0' }}>
        {tmpUser.cong_id !== '' && (
          <Box sx={{ marginBottom: '15px' }}>
            <UserCongregationRemove user={user} tmpUser={tmpUser} setTmpUser={(value) => setTmpUser(value)} />
          </Box>
        )}
        {user.cong_id !== '' && (
          <Box sx={{ marginBottom: '15px' }}>
            <CongregationMemberRole user={user} tmpUser={tmpUser} setTmpUser={(value) => setTmpUser(value)} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default UserCongregation;
