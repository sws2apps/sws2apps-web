import { useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import TokenIcon from '@mui/icons-material/Token';
import Typography from '@mui/material/Typography';
import UserActionConfirmation from './UserActionConfirmation';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { handleAdminLogout } from '../../utils/admin';
import { apiFetchUsers, apiUserDelete, apiUserTokenRevoke } from '../../api/users';

const UserAccountDetails = ({ user }) => {
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

  const handleRevokeTokenPre = () => {
    setTitle('Revoke User Token');
    setContent(
      `Are you sure to revoke ${user.username} token? This action will invalidate the account registered on any authenticator app.`
    );
    setCallback({ action: handleRevokeTokenPost });
    setConfirmOpen(true);
  };

  const handleRevokeTokenPost = async () => {
    try {
      setConfirmOpen(false);
      setOpenModal(true);

      const { status, data } = await apiUserTokenRevoke(user.id);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['users'],
          queryFn: apiFetchUsers,
        });
        setAppMessage('User MFA token revoked successfully');
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

  const handleUserDeletePre = () => {
    setTitle('Delete');
    setContent(`Are you sure to delete the user: ${user.username}?`);
    setCallback({ action: handleUserDeletePost });
    setConfirmOpen(true);
  };

  const handleUserDeletePost = async () => {
    try {
      setConfirmOpen(false);
      setOpenModal(true);

      const { status, data } = await apiUserDelete(user.id);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['users'],
          queryFn: apiFetchUsers,
        });
        setAppMessage('User deleted successfully');
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

  return (
    <Box sx={{ borderBottom: '1px outset', paddingBottom: '10px' }}>
      {confirmOpen && (
        <UserActionConfirmation
          title={title}
          content={content}
          confirmOpen={confirmOpen}
          setConfirmOpen={(value) => setConfirmOpen(value)}
          callback={callback}
        />
      )}

      <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Actions</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '10px 0', flexWrap: 'wrap' }}>
        {user.global_role !== 'pocket' && (
          <Button startIcon={<TokenIcon color="error" />} variant="outlined" onClick={handleRevokeTokenPre}>
            Revoke token
          </Button>
        )}
        <Button startIcon={<DeleteIcon color="error" />} variant="outlined" onClick={handleUserDeletePre}>
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default UserAccountDetails;
