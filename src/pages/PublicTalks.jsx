import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import Typography from '@mui/material/Typography';
import { publicTalkImportOpenState, publicTalksListState } from '../states/congregation';
import { PublicTalkContainer, PublicTalkImport, PublicTalkPagination } from '../features/publicTalks';
import { apiFetchPublicTalks } from '../api/congregation';

const PublicTalks = () => {
  const { isLoading, data } = useQuery({
    queryKey: ['public_talks'],
    queryFn: apiFetchPublicTalks,
    staleTime: 60000,
  });

  const [publicTalks, setPublicTalks] = useRecoilState(publicTalksListState);
  const [openImport, setOpenImport] = useRecoilState(publicTalkImportOpenState);

  const [page, setPage] = useState(0);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

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

      {openImport && <PublicTalkImport />}

      <Box sx={{ margin: '20px 0', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
        {publicTalks.length > 0 && (
          <PublicTalkPagination count={publicTalks.length} page={page} handleChangePage={handleChangePage} />
        )}

        {publicTalks.slice(page * 10, page * 10 + 10).map((talk) => (
          <PublicTalkContainer currentPage={page} key={talk.talk_number} talk_number={talk.talk_number} />
        ))}

        {publicTalks.length > 0 && (
          <PublicTalkPagination count={publicTalks.length} page={page} handleChangePage={handleChangePage} />
        )}
      </Box>
    </Box>
  );
};

export default PublicTalks;
