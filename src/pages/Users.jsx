import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { apiFetchUsers } from '../utils/api';
import { UserCard } from '../features/users';

const Users = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['users'],
    queryFn: apiFetchUsers,
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        {`List of Users`}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        {!isLoading && data.length && data.length > 0 && data.map((user) => <UserCard key={user.id} user={user} />)}
      </Box>
    </Box>
  );
};

export default Users;
