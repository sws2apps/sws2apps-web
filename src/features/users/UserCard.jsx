import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import GradeIcon from '@mui/icons-material/Grade';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from '@mui/material/Paper';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import Typography from '@mui/material/Typography';
import { formatLastSeen } from '../../utils/date';

const UserCard = ({ user }) => {
  const navigate = useNavigate();

  const handleOpenUser = () => {
    navigate(`/users/${user.id}`);
  };

  return (
    <Paper elevation={3} sx={{ padding: '10px', width: '350px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <Avatar
          sx={{
            backgroundColor: user.global_role === 'admin' ? 'red' : user.global_role === 'vip' ? 'green' : '#5B2C6F',
          }}
        >
          {user.global_role === 'admin' && <SecurityIcon />}
          {user.global_role === 'vip' && <GradeIcon />}
          {user.global_role === 'pocket' && <PersonIcon />}
        </Avatar>
        <Box sx={{ width: '100%' }}>
          <Box>
            <Box sx={{ height: '60px', marginBottom: '15px' }}>
              <Typography sx={{ fontWeight: 'bold' }}>{user.username}</Typography>
              <Typography sx={{ fontSize: '14px' }}>{user.user_uid}</Typography>
            </Box>

            {user.last_seen && <Chip color="success" label={formatLastSeen(user.last_seen)} />}
            {user.last_seen === undefined && <Chip color="primary" label="Not connected recently" />}
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'flex-end',
              borderTop: '1px outset',
              marginTop: '10px',
              paddingTop: '10px',
              gap: '5px',
            }}
          >
            <Button size="small" variant="outlined" endIcon={<OpenInNewIcon />} onClick={handleOpenUser}>
              Open
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserCard;
