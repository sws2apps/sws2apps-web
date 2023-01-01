import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { congregationRequestsState, countCongregationRequestsState } from '../states/congregation';
import { CongregationRequestCard } from '../features/congregations';
import { apiFetchCongregationRequests } from '../utils/api';

const CongregationRequests = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['congregationRequests'],
    queryFn: apiFetchCongregationRequests,
  });

  const [congregationRequests, setCongregationRequests] = useRecoilState(congregationRequestsState);

  const countCongregationRequests = useRecoilValue(countCongregationRequestsState);

  useEffect(() => {
    if (!isLoading) setCongregationRequests(data);
  }, [isLoading, data, setCongregationRequests]);

  return (
    <Box>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        {`List of Congregation Requests (${countCongregationRequests})`}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        {congregationRequests.length > 0 &&
          congregationRequests.map((request) => <CongregationRequestCard key={request.id} request={request} />)}
      </Box>
    </Box>
  );
};

export default CongregationRequests;
