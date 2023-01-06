import { useNavigate } from 'react-router-dom';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AnnouncementCard = ({ announcement, isLocked }) => {
  let navigate = useNavigate();

  const getDate = (varDate) => {
    return dateFormat(varDate, 'mmmm dd, yyyy');
  };

  const handleViewAnnouncement = () => {
    navigate(`/announcements/${announcement.id}`);
  };

  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Paper elevation={3} sx={{ padding: '10px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <NotificationsIcon sx={{ fontSize: '30px', color: '#D35400' }} />
          <Typography color="primary" sx={{ fontWeight: 'bold', lineHeight: 1.2, marginLeft: '5px' }}>
            {announcement.data.E.title}
          </Typography>
        </Box>
        <Typography
          sx={{
            lineHeight: 1.2,
            marginTop: '10px',
            marginLeft: '35px',
            height: '60px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            display: '-webkit-box !important',
            WebkitLineClamp: '3',
            whiteSpace: 'normal',
          }}
        >
          {announcement.data.E.desc}
        </Typography>
        <Box
          sx={{
            marginTop: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton onClick={handleViewAnnouncement}>
            <VisibilityIcon />
          </IconButton>

          <Box>
            <Typography
              sx={{
                fontStyle: 'italic',
                fontSize: '12px',
                textAlign: 'right',
              }}
              gutterBottom={false}
            >
              {announcement.publishedDate
                ? `Published on ${getDate(announcement.publishedDate)}`
                : 'Draft, not published yet'}
            </Typography>
            <Typography
              sx={{
                fontStyle: 'italic',
                fontSize: '12px',
                textAlign: 'right',
              }}
            >
              {`Expired on ${getDate(announcement.expiredDate)}`}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default AnnouncementCard;
