import { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { getLongDate } from '../utils/date';
import { CongregationRequestDisapprove } from '../features/congregations';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { rootModalOpenState } from '../states/main';
import { apiCongregationRequestApprove, apiFetchCongregationRequests } from '../utils/api';
import { handleAdminLogout } from '../utils/admin';

const CongregationRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const query = queryClient.getQueryData(['congregationRequests']);
  const request = query?.find((request) => request.id === id);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const [disapproveAnchorEl, setDisapproveAnchorEl] = useState(null);

  const openDisapprove = Boolean(disapproveAnchorEl);
  const idDisapprove = openDisapprove ? 'simple-popover' : undefined;

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleOpenDisapprove = (e) => {
    setDisapproveAnchorEl(e.currentTarget);
  };

  const handleCloseDisapprove = () => {
    setDisapproveAnchorEl(null);
  };

  const handleBackRequests = () => {
    navigate('/congregations/requests');
  };

  const handleCongregationApprove = async () => {
    try {
      setOpenModal(true);

      const { status, data } = await apiCongregationRequestApprove(request.id);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['congregationRequests'],
          queryFn: apiFetchCongregationRequests,
        });
        setAppMessage('Congregation account approved and created');
        setAppSeverity('info');
        setAppSnackOpen(true);
        navigate('/congregations/requests');
      } else if (status === 403) {
        handleClearAdmin();
      } else {
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }

      setOpenModal(false);
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
      setOpenModal(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <IconButton onClick={handleBackRequests}>
          <ArrowCircleLeftIcon sx={{ fontSize: '30px' }} />
        </IconButton>
        <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Congregation Request Details</Typography>
      </Box>

      <Box sx={{ marginTop: '10px', padding: '10px', maxWidth: '900px' }}>
        <Paper elevation={3} sx={{ padding: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <HomeWorkIcon color="primary" sx={{ fontSize: '40px' }} />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                alignItems: 'center',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ minWidth: '240px' }}>
                <Typography>
                  <strong>Name:</strong> {request.cong_name}
                </Typography>
                <Typography>
                  <strong>Number:</strong> {request.cong_number}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <Button
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleCongregationApprove}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DoNotDisturbOnIcon />}
                    onClick={handleOpenDisapprove}
                    aria-describedby={idDisapprove}
                  >
                    Disapprove
                  </Button>
                  <Popover
                    id={idDisapprove}
                    open={openDisapprove}
                    anchorEl={disapproveAnchorEl}
                    onClose={handleCloseDisapprove}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    sx={{ marginTop: '5px' }}
                  >
                    <CongregationRequestDisapprove request={request} handleCloseDisapprove={handleCloseDisapprove} />
                  </Popover>
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>Requestor Details</Typography>
          <Box
            sx={{
              marginTop: '10px',
              display: 'flex',
              flexDirection: 'column',
              gap: '3px',
            }}
          >
            <Typography>
              <strong>Name:</strong> {request.username}
            </Typography>
            <Typography>
              <strong>Email:</strong> {request.email}
            </Typography>
            <Typography>
              <strong>Role:</strong> {request.cong_role.join(', ')}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ fontSize: '14px', fontStyle: 'italic' }}>
            Request received on: {getLongDate(request.request_date)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CongregationRequestDetails;
