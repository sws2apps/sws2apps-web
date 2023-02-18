import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { UserAccountDetails, UserBasic, UserCongregation } from '../features/users';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const query = queryClient.getQueryData(['users']);
  const user = query?.find((user) => user.id === id);

  const handleBackUsers = () => {
    navigate('/users');
  };

  if (!user) return <Navigate to="/users" />;

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <IconButton onClick={handleBackUsers}>
          <ArrowCircleLeftIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>User Details</Typography>
      </Box>

      <Box sx={{ marginTop: '20px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <UserBasic user={user} />
        <UserAccountDetails user={user} />
        {user.cong_id !== '' && <UserCongregation user={user} />}
      </Box>
    </Box>
  );
};

export default UserDetails;
