import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { apiCongregationRequestDisapprove, apiFetchCongregationRequests } from '../../utils/api';
import { handleAdminLogout } from '../../utils/admin';

const CongregationRequestDisapprove = ({ handleCloseDisapprove, request }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const disapprovalReason = useRef();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleCongregationDisapprove = async () => {
    try {
      setOpenModal(true);

      const reason = disapprovalReason.current.value;
      if (reason.length === 0) {
        setAppMessage('Provide a disapproval reason');
        setAppSeverity('warning');
        setAppSnackOpen(true);
      } else {
        const { status, data } = await apiCongregationRequestDisapprove(request.id, reason);

        if (status === 200) {
          handleCloseDisapprove();
          await queryClient.prefetchQuery({
            queryKey: ['congregationRequests'],
            queryFn: apiFetchCongregationRequests,
          });
          setAppMessage('Congregation account request disapproved');
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
    <Box sx={{ padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
      <TextField
        id="outlined-multiline-flexible"
        label="Disapproval reason"
        multiline
        maxRows={4}
        sx={{ width: '280px' }}
        inputRef={disapprovalReason}
      />
      <Box>
        <Button variant="outlined" color="primary" endIcon={<SendIcon />} onClick={handleCongregationDisapprove}>
          OK
        </Button>
      </Box>
    </Box>
  );
};

export default CongregationRequestDisapprove;
