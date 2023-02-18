import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Chip from '@mui/material/Chip';
import GradeIcon from '@mui/icons-material/Grade';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import Typography from '@mui/material/Typography';
import emailIcon from '../../img/email.svg';
import githubIcon from '../../img/github.svg';
import googleIcon from '../../img/google.svg';
import microsoftIcon from '../../img/microsoft.svg';
import yahooIcon from '../../img/yahoo.svg';

const UserBasic = ({ user }) => {
  const [status, setStatus] = useState(true);

  const getUserAccountIcon = () => {
    if (user.auth_provider === 'email' || user.auth_provider === 'password') return emailIcon;
    if (user.auth_provider === 'github.com') return githubIcon;
    if (user.auth_provider === 'google.com') return googleIcon;
    if (user.auth_provider === 'microsoft.com') return microsoftIcon;
    if (user.auth_provider === 'yahoo.com') return yahooIcon;
  };

  useEffect(() => {
    if (!user.mfaEnabled && user.global_role !== 'pocket') {
      setStatus(false);
      return;
    }

    setStatus(true);
  }, [user]);

  return (
    <Box
      sx={{ display: 'flex', alignItems: 'flex-start', gap: '15px', borderBottom: '1px outset', paddingBottom: '10px' }}
    >
      <Avatar
        sx={{
          backgroundColor: user.global_role === 'admin' ? 'red' : user.global_role === 'vip' ? 'green' : '#5B2C6F',
        }}
      >
        {user.global_role === 'admin' && <SecurityIcon />}
        {user.global_role === 'vip' && <GradeIcon />}
        {user.global_role === 'pocket' && <PersonIcon />}
      </Avatar>
      <Box>
        <Typography sx={{ fontWeight: 'bold' }}>{user.username}</Typography>
        <Typography sx={{ fontSize: '14px' }}>{user.user_uid}</Typography>
        <Box
          sx={{
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '5px',
          }}
        >
          {user.global_role !== 'pocket' && (
            <Box sx={{ width: '50px', display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: 'white',
                  padding: '10px',
                  marginLeft: '1px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img alt="Account Provider Icon" src={getUserAccountIcon()} style={{ width: '18px', height: '18px' }} />
              </Box>
            </Box>
          )}

          {status && <Chip color="success" icon={<CheckCircleIcon />} label="Healthy Account" />}
          {user.global_role !== 'pocket' && !user.mfaEnabled && <Chip label="MFA Verification" />}
        </Box>
      </Box>
    </Box>
  );
};

export default UserBasic;
