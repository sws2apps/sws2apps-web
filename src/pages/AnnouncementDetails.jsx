import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import Select from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiHostState, rootModalOpenState, userEmailState, visitorIDState } from '../states/main';
import { handleAdminLogout } from '../utils/admin';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

const AnnouncementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = queryClient.getQueryData(['announcements']);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setModalOpen = useSetRecoilState(rootModalOpenState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const userEmail = useRecoilValue(userEmailState);

  const [language, setLanguage] = useState('E');
  const [announcement, setAnnouncement] = useState({
    id: id,
    appTarget: 'lmm-oa',
    expiredDate: new Date(),
    data: {
      E: { title: '', desc: '', content: '<p></p>' },
      MG: { title: '', desc: '', content: '<p></p>' },
    },
  });

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleTargetChange = (value) => {
    setAnnouncement((prev) => {
      return { ...prev, appTarget: value };
    });
  };

  const handleExpiredChange = (newValue) => {
    setAnnouncement((prev) => {
      return { ...prev, expiredDate: newValue };
    });
  };

  const handleTitleChange = (e) => {
    setAnnouncement((prev) => {
      const data = {
        ...prev.data,
        [language]: {
          ...prev.data[language],
          title: e.target.value,
        },
      };

      const obj = { ...prev, data };

      return { ...obj };
    });
  };

  const handleDescChange = (e) => {
    setAnnouncement((prev) => {
      const data = {
        ...prev.data,
        [language]: {
          ...prev.data[language],
          desc: e.target.value,
        },
      };

      const obj = { ...prev, data };

      return { ...obj };
    });
  };

  const handleContentChange = (e) => {
    setAnnouncement((prev) => {
      const data = {
        ...prev.data,
        [language]: {
          ...prev.data[language],
          content: e.target.value,
        },
      };

      const obj = { ...prev, data };

      return { ...obj };
    });
  };

  const handleSaveDraft = async () => {
    try {
      if (apiHost !== '') {
        setModalOpen(true);

        const reqPayload = {
          announcement: announcement,
          action: 'save',
        };

        const res = await fetch(`${apiHost}api/admin/announcements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            email: userEmail,
            visitorid: visitorID,
          },
          body: JSON.stringify(reqPayload),
        });

        if (res.status === 200) {
          navigate('/announcements');
        } else if (res.status === 403) {
          handleClearAdmin();
        } else {
          const data = await res.json();
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
          navigate('/announcements');
        }

        setModalOpen(false);
      }
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
      navigate('/announcements');
      setModalOpen(false);
    }
  };

  const handlePublish = async () => {
    try {
      if (apiHost !== '') {
        setModalOpen(true);
        const reqPayload = {
          announcement: announcement,
          action: 'publish',
        };

        const res = await fetch(`${apiHost}api/admin/announcements`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            email: userEmail,
            visitorid: visitorID,
          },
          body: JSON.stringify(reqPayload),
        });

        if (res.status === 200) {
          navigate('/announcements');
        } else if (res.status === 403) {
          handleClearAdmin();
        } else {
          const data = await res.json();
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
          navigate('/announcements');
        }

        setModalOpen(false);
      }
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
      navigate('/announcements');
      setModalOpen(false);
    }
  };

  useEffect(() => {
    if (id) {
      const tmp = query?.find((announcement) => announcement.id === id);
      if (tmp) setAnnouncement(tmp);
    }
  }, [id, query]);

  return (
    <Box>
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        {id ? 'Edit Announcement' : 'Create New Announcement'}
      </Typography>

      <Box
        sx={{
          minHeight: '20px',
          borderRadius: '8px',
          marginTop: '50px',
          marginBottom: '100px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <FormControl size="small">
            <InputLabel id="select-announcement-language">Language</InputLabel>
            <Select
              labelId="select-announcement-language"
              id="select-announcement-language"
              value={language}
              label="Language"
              onChange={handleLanguageChange}
            >
              <MenuItem value={'E'}>English</MenuItem>
              <MenuItem value={'MG'}>Malagasy</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ width: '130px' }}>
            <InputLabel id="select-announcement-target">Application target</InputLabel>
            <Select
              labelId="select-announcement-target"
              id="select-announcement-target"
              value={announcement.appTarget}
              label="Application target"
              onChange={handleTargetChange}
            >
              <MenuItem value={'lmm-oa'}>LMM-OA</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Expired date"
              inputFormat="MM/dd/yyyy"
              value={announcement.expiredDate}
              onChange={(value) => handleExpiredChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  sx={{
                    width: '180px !important',
                    '.MuiInputBase-inputAdornedEnd': {
                      padding: '9px !important',
                    },
                  }}
                />
              )}
            />
          </LocalizationProvider>
        </Box>

        <Box sx={{ marginTop: '10px' }}>
          <TextField
            id="announcement=title"
            label="Announcement title"
            variant="standard"
            fullWidth
            value={announcement.data[language].title}
            onChange={handleTitleChange}
          />
          <TextField
            id="announcement-description"
            label="Announcement description"
            variant="standard"
            fullWidth
            sx={{ marginTop: '20px' }}
            value={announcement.data[language].desc}
            onChange={handleDescChange}
          />
          <Typography sx={{ marginTop: '20px' }}>Announcement body</Typography>
          <Box sx={{ display: 'flex', marginTop: '20px', flexWrap: 'wrap' }}>
            <Box sx={{ width: '50%', minWidth: '320px', flexGrow: 1 }}>
              <TextField
                id="announcement-body-html"
                label="HTML"
                fullWidth
                multiline
                value={announcement.data[language].content}
                onChange={handleContentChange}
              />
            </Box>
            <Box
              sx={{
                width: '50%',
                paddingLeft: '10px',
                overflow: 'auto',
                flexGrow: 1,
                minHeight: '150px',
              }}
            >
              <Markup content={announcement.data[language].content} noWrap={false} />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleSaveDraft}>
          <SaveAsIcon />
        </Fab>
        <Fab aria-label="save" color="primary" onClick={handlePublish}>
          <SendIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default AnnouncementDetails;
