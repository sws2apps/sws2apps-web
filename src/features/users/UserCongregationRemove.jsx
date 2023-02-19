import { useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import Paper from '@mui/material/Paper';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { handleAdminLogout } from '../../utils/admin';
import UserActionConfirmation from './UserActionConfirmation';
import { apiCongregationRemoveUser } from '../../api/congregation';
import { apiFetchUsers } from '../../api/users';

const UserCongregationRemove = ({ user, tmpUser, setTmpUser }) => {
  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [callback, setCallback] = useState({ action: null });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleCongregationRemovePre = () => {
    if (user.cong_id !== '') {
      setTitle('Remove congregation');
      setContent(`Are you sure to remove ${user.username}? from this congregation?`);
      setCallback({ action: handleCongregationRemovePost });
      setConfirmOpen(true);

      return;
    }

    handleRemoveTmpCongregation();
  };

  const handleCongregationRemovePost = async () => {
    try {
      setConfirmOpen(false);
      setOpenModal(true);

      const { status, data } = await apiCongregationRemoveUser(user.cong_id, user.id);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['users'],
          queryFn: apiFetchUsers,
        });
        setAppMessage('User removed from congregation successfully');
        setAppSeverity('info');
        setAppSnackOpen(true);
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

  const handleRemoveTmpCongregation = () => {
    setTmpUser((prev) => {
      return { ...prev, cong_id: '', cong_name: '', cong_number: '', cong_role: [] };
    });
  };

  return (
    <Paper elevation={3} sx={{ padding: '10px', maxWidth: '900px' }}>
      {confirmOpen && (
        <UserActionConfirmation
          title={title}
          content={content}
          confirmOpen={confirmOpen}
          setConfirmOpen={(value) => setConfirmOpen(value)}
          callback={callback}
        />
      )}

      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <HomeWorkIcon color="secondary" sx={{ fontSize: '40px' }} />
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <Box sx={{ marginRight: '30px' }}>
            <Typography sx={{ fontWeight: 'bold' }}>
              {tmpUser.cong_country} - {tmpUser.cong_name}
            </Typography>
            <Typography>{tmpUser.cong_number}</Typography>
          </Box>
          <Box>
            <Button
              color="error"
              variant="outlined"
              startIcon={<PersonRemoveIcon />}
              onClick={handleCongregationRemovePre}
            >
              Remove
            </Button>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserCongregationRemove;
