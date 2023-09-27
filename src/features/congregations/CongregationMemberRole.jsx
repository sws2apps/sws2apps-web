import { useCallback, useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { handleAdminLogout } from '../../utils/admin';
import { apiCongregationUserUpdateRole, apiFetchCongregationsByCountry } from '../../api/congregation';
import { apiFetchUsers } from '../../api/users';

const styles = {
  checkbox: {
    paddingTop: '0 !important',
  },
};

const CongregationMemberRole = ({ user, tmpUser, setTmpUser }) => {
  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const [btnUpdateVisible, setBtnUpdateVisible] = useState(false);

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleCheckAdmin = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'admin'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'admin');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckLMMO = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'lmmo'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'lmmo');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckLMMOAssistant = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'lmmo-backup'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'lmmo-backup');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckViewMeetingSchedule = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'view_meeting_schedule'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'view_meeting_schedule');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckSecretary = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'secretary'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'secretary');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckCoordinator = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'coordinator'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'coordinator');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckPublicTalkCoordinator = (value) => {
    let role = [];
    if (value) {
      role = [...tmpUser.cong_role, 'public_talk_coordinator'];
    } else {
      role = tmpUser.cong_role.filter((role) => role !== 'public_talk_coordinator');
    }

    setTmpUser((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleUpdateRole = async () => {
    try {
      setOpenModal(true);

      const { status, data } = await apiCongregationUserUpdateRole(user.cong_id, user.user_uid, tmpUser.cong_role);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['users'],
          queryFn: apiFetchUsers,
        });
        await queryClient.prefetchQuery({
          queryKey: ['congregations'],
          queryFn: apiFetchCongregationsByCountry,
        });
        setAppMessage('User roles updated successfully');
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

  useEffect(() => {
    const compareRole = (a, b) => a.length === b.length && a.every((element) => b.includes(element));

    if (!compareRole(user.cong_role, tmpUser.cong_role)) {
      setBtnUpdateVisible(true);
      return;
    }

    setBtnUpdateVisible(false);
  }, [user, tmpUser]);

  return (
    <Box>
      <Typography sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Congregation Roles/Priviledges</Typography>

      <Grid container spacing={2} sx={{ marginTop: '15px' }}>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('admin') || false}
                disabled={tmpUser.global_role === 'pocket'}
                onChange={(e) => handleCheckAdmin(e.target.checked)}
              />
            }
            label="Administrator"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('coordinator') || false}
                disabled={tmpUser.global_role === 'pocket'}
                onChange={(e) => handleCheckCoordinator(e.target.checked)}
              />
            }
            label="Coordinator"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('secretary') || false}
                disabled={tmpUser.global_role === 'pocket'}
                onChange={(e) => handleCheckSecretary(e.target.checked)}
              />
            }
            label="Secretary"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('lmmo') || false}
                disabled={tmpUser.global_role === 'pocket'}
                onChange={(e) => handleCheckLMMO(e.target.checked)}
              />
            }
            label="Life and Ministry Meeting Overseer"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('lmmo-backup') || false}
                disabled={tmpUser.global_role === 'pocket'}
                onChange={(e) => handleCheckLMMOAssistant(e.target.checked)}
              />
            }
            label="Life and Ministry Meeting Overseer - Assistant"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('public_talk_coordinator') || false}
                disabled={tmpUser.global_role === 'pocket'}
                onChange={(e) => handleCheckPublicTalkCoordinator(e.target.checked)}
              />
            }
            label="Public Talk Coordinator"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
          <FormControlLabel
            control={
              <Checkbox
                checked={tmpUser.cong_role?.includes('view_meeting_schedule') || false}
                onChange={(e) => handleCheckViewMeetingSchedule(e.target.checked)}
              />
            }
            label="View Meeting Schedule"
          />
        </Grid>
      </Grid>

      {btnUpdateVisible && (
        <Box sx={{ marginTop: '10px' }}>
          <Button startIcon={<SaveIcon />} variant="outlined" onClick={handleUpdateRole}>
            Update
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CongregationMemberRole;
