import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { useQueryClient } from '@tanstack/react-query';
import { fileDialog } from 'file-select-dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { publicTalkImportOpenState } from '../../states/congregation';
import { LANGUAGE_LIST } from '../../constant/langList';
import { apiBulkUpdatePublicTalks, apiFetchPublicTalks } from '../../api/congregation';

const PublicTalkImport = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useRecoilState(publicTalkImportOpenState);

  const [language, setLanguage] = useState('e');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
      return;
    }

    setOpen(false);
  };

  const handleImportJSON = async () => {
    const file = await fileDialog({
      accept: '.json',
      strict: true,
    });

    setIsProcessing(true);
    const talks = JSON.parse(await file.text());
    await handleUpdateTalk(talks);
    handleClose();
  };

  const handleUpdateTalk = async (talks) => {
    try {
      const tmpLanguage = language.toUpperCase();
      await apiBulkUpdatePublicTalks(tmpLanguage, talks);
      await queryClient.prefetchQuery({
        queryKey: ['public_talks'],
        queryFn: apiFetchPublicTalks,
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Import Public Talks</DialogTitle>
        <DialogContent>
          <Box sx={{ width: '350px', marginTop: '5px' }}>
            {!isProcessing && (
              <>
                <FormControl sx={{ width: '200px' }}>
                  <InputLabel id="demo-simple-select-label">Language</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={language}
                    label="Language"
                    size="small"
                    onChange={handleChange}
                  >
                    {LANGUAGE_LIST.map((language) => (
                      <MenuItem key={language.code} value={language.code}>
                        {language.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button
                  variant="outlined"
                  sx={{ marginTop: '20px', width: '100%', height: '200px', textTransform: 'none' }}
                  onClick={handleImportJSON}
                >
                  Browse JSON file
                </Button>
              </>
            )}
            {isProcessing && (
              <Container
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '20px',
                }}
              >
                <CircularProgress color="secondary" size={'80px'} disableShrink />
              </Container>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus disabled={isProcessing}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PublicTalkImport;
