import { useRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { publicTalksListState } from '../states/congregation';
import { PublicTalkContainer } from '../features/publicTalks';
import { useEffect } from 'react';
import { apiFetchPublicTalks } from '../api/congregation';

const PublicTalks = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['congregations'],
    queryFn: apiFetchPublicTalks,
  });

  const [publicTalks, setPublicTalks] = useRecoilState(publicTalksListState);

  useEffect(() => {
    if (!isLoading) setPublicTalks(data);
  }, [isLoading, data, setPublicTalks]);

  return (
    <Box>
      <Typography variant="h6">PUBLIC TALKS</Typography>
      <Box sx={{ marginTop: '20px', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {publicTalks.map((talk) => (
          <PublicTalkContainer key={talk.talk_number} talk_number={talk.talk_number} />
        ))}
        <PublicTalkContainer isNew={true} />
      </Box>
    </Box>
  );
};

export default PublicTalks;
