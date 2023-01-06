import { useQuery } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { AnnouncementCard } from '../features/announcements';
import { apiFetchAnnouncements } from '../utils/api';

const Announcements = () => {
  const { isLoading, error, data } = useQuery({ queryKey: ['announcements'], queryFn: apiFetchAnnouncements });

  return (
    <Box>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        List of announcements
      </Typography>
      {isLoading && (
        <CircularProgress
          color="secondary"
          size={60}
          disableShrink={true}
          sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, margin: 'auto' }}
        />
      )}
      {error && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            marginTop: '60px',
          }}
        >
          <ErrorIcon color="error" sx={{ fontSize: '40px' }} />
          <Typography align="center">An error occured from the server</Typography>
        </Box>
      )}
      {data && data.length > 0 && (
        <Box sx={{ flexGrow: 1, marginTop: '20px' }}>
          <Grid container spacing={2}>
            {data.map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default Announcements;
