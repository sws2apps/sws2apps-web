import { useRecoilState, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Typography from '@mui/material/Typography';
import { publicTalkImportOpenState, publicTalksListState } from '../states/congregation';
import { PublicTalkContainer, PublicTalkImport } from '../features/publicTalks';
import { useEffect } from 'react';
import { apiFetchPublicTalks } from '../api/congregation';

const PublicTalks = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['public_talks'],
    queryFn: apiFetchPublicTalks,
    staleTime: 60000,
  });

  const [publicTalks, setPublicTalks] = useRecoilState(publicTalksListState);

  const setOpenImport = useSetRecoilState(publicTalkImportOpenState);

  const handleClickOpen = () => {
    setOpenImport(true);
  };

  useEffect(() => {
    if (!isLoading) setPublicTalks(data);
  }, [isLoading, data, setPublicTalks]);

  return (
    <Box>
      <Typography variant="h6">PUBLIC TALKS</Typography>
      <Button variant="outlined" startIcon={<ImportExportIcon />} sx={{ marginTop: '20px' }} onClick={handleClickOpen}>
        Import JSON
      </Button>
      <PublicTalkImport />
      <Box sx={{ margin: '20px 0', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {publicTalks.map((talk) => (
          <PublicTalkContainer key={talk.talk_number} talk_number={talk.talk_number} />
        ))}
        <PublicTalkContainer isNew={true} />
      </Box>
    </Box>
  );
};

export default PublicTalks;
