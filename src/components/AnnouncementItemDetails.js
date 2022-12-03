import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { format } from 'date-fns';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import MenuItem from '@mui/material/MenuItem';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import Select from '@mui/material/Select';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { handleAdminLogout } from '../utils/admin';
import { adminEmailState, apiHostState, dbAnnouncementsState, visitorIDState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';

const AnnouncementItemDetails = () => {
  const { id } = useParams();
  let navigate = useNavigate();
  let abortCont = useMemo(() => new AbortController(), []);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setDbAnnouncements = useSetRecoilState(dbAnnouncementsState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const adminEmail = useRecoilValue(adminEmailState);

  const [language, setLanguage] = useState('E');
  const [appTarget, setAppTarget] = useState('lmm-oa');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementDesc, setAnnouncementDesc] = useState('');
  const [bodyContent, setBodyContent] = useState('<p></p>');
  const [expiredDate, setExpiredDate] = useState(format(new Date(), 'MM/dd/yyyy'));
  const [publishedDate, setPublishedDate] = useState(null);
  const [announcement, setAnnouncement] = useState({});
  const [isProcessing, setIsProcessing] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleBackToList = () => {
    navigate('/administration/announcements');
  };

  const handleExpiredChange = (newValue) => {
    setExpiredDate(format(newValue, 'MM/dd/yyyy'));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleTargetChange = (e) => {
    setAppTarget(e.target.value);
  };

  const handleGetAnnouncement = useCallback(async () => {
    if (apiHost !== '') {
      fetch(`${apiHost}api/admin/announcement`, {
        signal: abortCont.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          email: adminEmail,
          visitorid: visitorID,
          announcement_id: id,
        },
      })
        .then(async (res) => {
          if (abortCont.signal.aborted === false) {
            if (res.status === 200) {
              const tmp = await res.json();
              setAnnouncement(tmp);
            } else if (res.status === 403) {
              handleClearAdmin();
            }
            setIsProcessing(false);
          }
        })
        .catch((err) => {
          if (abortCont.signal.aborted === false) {
            setAppMessage(err.message);
            setAppSeverity('error');
            setAppSnackOpen(true);
            setIsProcessing(false);
          }
        });
    }
  }, [adminEmail, apiHost, id, visitorID, handleClearAdmin, setAppMessage, setAppSeverity, setAppSnackOpen, abortCont]);

  const handleSaveDraft = async () => {
    if (apiHost !== '') {
      setIsSaving(true);
      const reqPayload = {
        announcement: announcement,
      };

      fetch(`${apiHost}api/admin/announcement-save-draft`, {
        signal: abortCont.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          email: adminEmail,
          visitorid: visitorID,
        },
        body: JSON.stringify(reqPayload),
      })
        .then(async (res) => {
          if (res.status === 200) {
            const announcements = await res.json();
            setDbAnnouncements(announcements);
            navigate('/administration/announcements');
          } else if (res.status === 403) {
            handleClearAdmin();
          } else {
            const data = await res.json();
            setAppMessage(data.message);
            setAppSeverity('warning');
            setAppSnackOpen(true);
            navigate('/administration/announcements');
          }
        })
        .catch((err) => {
          setAppMessage(err.message);
          setAppSeverity('error');
          setAppSnackOpen(true);
          navigate('/administration/announcements');
        });
    }
  };

  const handlePublish = async () => {
    if (apiHost !== '') {
      setIsSaving(true);

      const d = new Date();
      announcement.publishedDate = format(d, 'MM/dd/yyyy');
      announcement.isDraft = false;

      const reqPayload = {
        announcement: announcement,
      };

      fetch(`${apiHost}api/admin/announcement-publish`, {
        signal: abortCont.signal,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          email: adminEmail,
          visitorid: visitorID,
        },
        body: JSON.stringify(reqPayload),
      })
        .then(async (res) => {
          if (res.status === 200) {
            const announcements = await res.json();
            setDbAnnouncements(announcements);
            navigate('/administration/announcements');
          } else if (res.status === 403) {
            handleClearAdmin();
          } else {
            const data = await res.json();
            setAppMessage(data.message);
            setAppSeverity('warning');
            setAppSnackOpen(true);
            navigate('/administration/announcements');
          }
        })
        .catch((err) => {
          setAppMessage(err.message);
          setAppSeverity('error');
          setAppSnackOpen(true);
          navigate('/administration/announcements');
        });
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (apiHost !== '') {
      setIsSaving(true);

      fetch(`${apiHost}api/admin/announcement`, {
        signal: abortCont.signal,
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          email: adminEmail,
          visitorid: visitorID,
          announcement_id: id,
        },
      })
        .then(async (res) => {
          if (!abortCont.signal.aborted) {
            if (res.status === 200) {
              const announcements = await res.json();
              setDbAnnouncements(announcements);
              navigate('/administration/announcements');
            } else if (res.status === 403) {
              handleClearAdmin();
            }
            setIsProcessing(false);
          }
        })
        .catch((err) => {
          if (!abortCont.signal.aborted) {
            setAppMessage(err.message);
            setAppSeverity('error');
            setAppSnackOpen(true);
            setIsProcessing(false);
          }
        });
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway' || reason === 'backdropClick') {
      return;
    }
    setIsSaving(false);
  };

  useEffect(() => {
    if (id) {
      handleGetAnnouncement();
    } else {
      setIsProcessing(false);
    }
  }, [handleGetAnnouncement, id]);

  useEffect(() => {
    let currentData = announcement;
    if (currentData) {
      setAppTarget(currentData.data.appTarget || 'lmm-oa');
      setExpiredDate(currentData.data.expiredDate || format(new Date(), 'MM/dd/yyyy'));
      setPublishedDate(currentData.data.publishedDate || null);
      if (language) {
        setAnnouncementTitle(currentData.data[language]?.title || '');
        setAnnouncementDesc(currentData.data[language]?.desc || '');
        setBodyContent(currentData.data[language]?.content || '<p></p>');
      }
    }
  }, [language, announcement]);

  useEffect(() => {
    let currentData = announcement;
    if (language) {
      currentData.data[language] = {};
      currentData.data[language].title = announcementTitle;
      currentData.data[language].desc = announcementDesc;
      currentData.data[language].content = bodyContent;
    }

    if (id) {
      currentData.id = id;
    }

    currentData.data.appTarget = appTarget;
    currentData.data.publishedDate = publishedDate;
    currentData.data.expiredDate = expiredDate;
    currentData.data.isDraft = true;

    setAnnouncement(currentData);
  }, [
    id,
    announcement,
    language,
    appTarget,
    announcementTitle,
    announcementDesc,
    bodyContent,
    expiredDate,
    publishedDate,
  ]);

  return (
    <Box>
      <Dialog open={isSaving} aria-labelledby='dialog-title-announcement-edit' onClose={handleClose}>
        <DialogTitle id='dialog-title-announcement-edit'>
          <Typography variant='h6' component='p'>
            Please wait ...
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Container
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '10px 50px',
            }}
          >
            <CircularProgress disableShrink color='secondary' size={'60px'} />
          </Container>
        </DialogContent>
      </Dialog>
      <Button variant='outlined' startIcon={<KeyboardBackspaceIcon />} onClick={handleBackToList}>
        Back to Announcements List
      </Button>
      {isProcessing && (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '60px',
          }}
        >
          <CircularProgress disableShrink color='secondary' size={'60px'} />
        </Container>
      )}
      {!isProcessing && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '20px',
            }}
          >
            <Typography
              sx={{
                marginTop: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {id === undefined ? 'Create new announcement' : 'Edit announcement'}
            </Typography>
            <Box>
              {publishedDate === null && (
                <Button
                  variant='outlined'
                  startIcon={<SaveAsIcon />}
                  sx={{ marginLeft: '5px' }}
                  onClick={handleSaveDraft}
                >
                  Save as draft
                </Button>
              )}

              <Button
                variant='outlined'
                color='success'
                startIcon={<SendIcon />}
                sx={{ marginLeft: '5px' }}
                onClick={handlePublish}
              >
                Publish
              </Button>
              {id && (
                <Button
                  variant='outlined'
                  color='error'
                  startIcon={<DeleteForeverIcon />}
                  sx={{ marginLeft: '5px' }}
                  onClick={handleDeleteAnnouncement}
                >
                  Delete
                </Button>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              border: '1px outset',
              minHeight: '20px',
              borderRadius: '8px',
              marginTop: '10px',
              padding: '20px',
            }}
          >
            <FormControl size='small'>
              <InputLabel id='select-announcement-language'>Language</InputLabel>
              <Select
                labelId='select-announcement-language'
                id='select-announcement-language'
                value={language}
                label='Language'
                onChange={handleLanguageChange}
              >
                <MenuItem value={'E'}>English</MenuItem>
                <MenuItem value={'MG'}>Malagasy</MenuItem>
              </Select>
            </FormControl>
            <FormControl size='small' sx={{ marginLeft: '10px', width: '130px' }}>
              <InputLabel id='select-announcement-target'>Application target</InputLabel>
              <Select
                labelId='select-announcement-target'
                id='select-announcement-target'
                value={appTarget}
                label='Application target'
                onChange={handleTargetChange}
              >
                <MenuItem value={'lmm-oa'}>LMM-OA</MenuItem>
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DesktopDatePicker
                label='Expired date'
                inputFormat='MM/dd/yyyy'
                value={expiredDate}
                onChange={handleExpiredChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      marginLeft: '10px !important',
                      width: '180px !important',
                      '.MuiInputBase-inputAdornedEnd': {
                        padding: '9px !important',
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
            <Box sx={{ marginTop: '10px' }}>
              <TextField
                id='announcement=title'
                label='Announcement title'
                variant='standard'
                fullWidth
                value={announcementTitle}
                onChange={(e) => setAnnouncementTitle(e.target.value)}
              />
              <TextField
                id='announcement-description'
                label='Announcement description'
                variant='standard'
                fullWidth
                sx={{ marginTop: '20px' }}
                value={announcementDesc}
                onChange={(e) => setAnnouncementDesc(e.target.value)}
              />
              <Typography sx={{ marginTop: '20px' }}>Announcement body</Typography>
              <Box sx={{ display: 'flex', marginTop: '10px' }}>
                <Box sx={{ width: '50%' }}>
                  <TextField
                    id='announcement-body-html'
                    label='HTML'
                    fullWidth
                    multiline
                    rows={6}
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                  />
                </Box>
                <Box
                  sx={{
                    width: '50%',
                    paddingLeft: '10px',
                    height: '160px',
                    overflow: 'auto',
                  }}
                >
                  <Markup content={bodyContent} />
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AnnouncementItemDetails;
