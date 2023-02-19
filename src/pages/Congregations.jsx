import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { CongregationCard } from '../features/congregations';
import { apiFetchCongregations } from '../api/congregation';

const Congregations = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['congregations'],
    queryFn: apiFetchCongregations,
  });

  return (
    <Box>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        {`List of Congregations`}
      </Typography>
      <Box sx={{ flexGrow: 1, marginTop: '20px' }}>
        <Grid container spacing={2}>
          {!isLoading &&
            data &&
            data.length > 0 &&
            data.map((congregation) => <CongregationCard key={congregation.id} congregation={congregation} />)}
        </Grid>
      </Box>
    </Box>
  );
};

export default Congregations;
