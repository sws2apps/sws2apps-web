import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { apiFetchCongregations } from '../utils/api';
import { CongregationCard } from '../features/congregations';

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        {!isLoading &&
          data.length &&
          data.length > 0 &&
          data.map((congregation) => <CongregationCard key={congregation.id} congregation={congregation} />)}
      </Box>
    </Box>
  );
};

export default Congregations;
