import { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { apiCongregationDelete, apiFetchCongregations } from '../../utils/api';
import { handleAdminLogout } from '../../utils/admin';

const CongregationCard = ({ congregation }) => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const totalVIP = congregation.cong_members.filter((member) => member.global_role === 'vip').length;
  const totalPocket = congregation.cong_members.filter((member) => member.global_role === 'pocket').length;

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleOpenCongregation = () => {
    navigate(`/congregations/${congregation.id}`);
  };

  const handleDeleteCongregation = async () => {
    try {
      setOpenModal(true);

      const { status, data } = await apiCongregationDelete(congregation.id);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['congregations'],
          queryFn: apiFetchCongregations,
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
    <Paper elevation={3} sx={{ padding: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <HomeWorkIcon color="secondary" sx={{ fontSize: '40px' }} />
        <Box>
          <Box sx={{ minWidth: '240px' }}>
            <Box>
              <Typography>{congregation.cong_name}</Typography>
              <Typography>{congregation.cong_number}</Typography>
            </Box>

            <Box sx={{ marginTop: '15px' }}>
              <Typography sx={{ fontSize: '14px' }}>VIP Users: {totalVIP}</Typography>
              <Typography sx={{ fontSize: '14px' }}>Pocket Users: {totalPocket}</Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              justifyContent: 'flex-end',
              borderTop: '1px outset',
              marginTop: '10px',
              paddingTop: '10px',
              gap: '5px',
            }}
          >
            <Button
              size="small"
              color="error"
              variant="outlined"
              endIcon={<DeleteIcon />}
              onClick={handleDeleteCongregation}
            >
              Delete
            </Button>
            <Button size="small" variant="outlined" endIcon={<OpenInNewIcon />} onClick={handleOpenCongregation}>
              Open
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default CongregationCard;
