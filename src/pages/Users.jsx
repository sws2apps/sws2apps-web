import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { UserCard } from '../features/users';
import { apiFetchUsers } from '../api/users';

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
      <Box sx={{ flexGrow: 1, marginTop: '20px' }}>
        <Grid container spacing={2}>
          {!isLoading && data.length && data.length > 0 && data.map((user) => <UserCard key={user.id} user={user} />)}
        </Grid>
      </Box>
    </Box>
  );
};

export default Users;
