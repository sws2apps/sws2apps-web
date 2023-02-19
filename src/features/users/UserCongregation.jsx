import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import { CongregationMemberRole } from '../congregations';
import UserCongregationRemove from './UserCongregationRemove';
import UserCongregationAssign from './UserCongregationAssign';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { apiCongregationAddUser, apiFetchCongregationsByCountry } from '../../api/congregation';
import { apiFetchUsers } from '../../api/users';
import { handleAdminLogout } from '../../utils/admin';
import UserActionConfirmation from './UserActionConfirmation';

const UserCongregation = ({ user }) => {
  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const [tmpUser, setTmpUser] = useState(user);
  const [btnUpdateVisible, setBtnUpdateVisible] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [callback, setCallback] = useState({ action: null });
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleCongregationAddPost = async () => {
    try {
      setConfirmOpen(false);
      setOpenModal(true);

      const { status, data } = await apiCongregationAddUser(
        tmpUser.cong_country,
        tmpUser.cong_name,
        tmpUser.cong_number,
        tmpUser.user_uid,
        tmpUser.cong_role
      );

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['users'],
          queryFn: apiFetchUsers,
        });
        await queryClient.prefetchQuery({
          queryKey: ['congregations'],
          queryFn: apiFetchCongregationsByCountry,
        });
        setAppMessage('User successfully added to the congregation');
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

  const handleCongregationAddPre = () => {
    setTitle('Add user to congregation');
    setContent(`Are you sure to add ${tmpUser.username} to ${tmpUser.cong_name} congregation?`);
    setCallback({ action: handleCongregationAddPost });
    setConfirmOpen(true);
  };

  useEffect(() => {
    setTmpUser(user);
  }, [user]);

  useEffect(() => {
    if (user.cong_name !== tmpUser.cong_name) {
      setBtnUpdateVisible(true);
      return;
    }

    setBtnUpdateVisible(false);
  }, [user, tmpUser]);

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

      <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Congregation Information</Typography>
      <Box sx={{ marginTop: '10px', padding: '10px 0' }}>
        {tmpUser.cong_name === '' && (
          <UserCongregationAssign tmpUser={tmpUser} setTmpUser={(value) => setTmpUser(value)} />
        )}
        {tmpUser.cong_name !== '' && (
          <Box sx={{ marginBottom: '15px' }}>
            <UserCongregationRemove user={user} tmpUser={tmpUser} setTmpUser={(value) => setTmpUser(value)} />
          </Box>
        )}
        {user.cong_name !== '' && (
          <Box sx={{ marginBottom: '15px' }}>
            <CongregationMemberRole user={user} tmpUser={tmpUser} setTmpUser={(value) => setTmpUser(value)} />
          </Box>
        )}
      </Box>
      {btnUpdateVisible && (
        <Box>
          <Button startIcon={<SaveIcon />} variant="outlined" onClick={handleCongregationAddPre}>
            Update
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default UserCongregation;
