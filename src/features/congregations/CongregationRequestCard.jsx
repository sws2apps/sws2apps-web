import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { getLongDate } from '../../utils/date';

const CongregationRequestCard = ({ request }) => {
  const navigate = useNavigate();

  const handleOpenRequest = () => {
    navigate(`/congregations/requests/${request.id}`);
  };

  return (
    <Paper elevation={3} sx={{ padding: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <HomeWorkIcon color="primary" sx={{ fontSize: '40px' }} />
        <Box
          sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Box sx={{ minWidth: '240px' }}>
            <Typography>
              <strong>Name:</strong> {request.cong_name}
            </Typography>
            <Typography>
              <strong>Number:</strong> {request.cong_number}
            </Typography>

            <Typography sx={{ marginTop: '10px', fontSize: '14px' }}>
              <strong>Requested on:</strong> {getLongDate(request.request_date)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
            <Box>
              <Button variant="outlined" endIcon={<OpenInNewIcon />} onClick={handleOpenRequest}>
                Open
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CongregationRequestCard;
