import { useCallback, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { fileDialog } from 'file-select-dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { geoFormatImport } from '../../utils/congregation';
import { apiCountriesBulkAdd } from '../../utils/api';
import { handleAdminLogout } from '../../utils/admin';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';

const CongregationsCountryImport = () => {
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const [language, setLanguage] = useState('E');

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleImportGeoList = async () => {
    try {
      const file = await fileDialog({
        accept: '.json',
        strict: true,
      });

      setOpenModal(true);
      const geo_list = await geoFormatImport(file);
      const { status, data } = await apiCountriesBulkAdd(geo_list, language);

      if (status === 200) {
        setAppMessage('Geo locations imported successfully');
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
    <Box
      sx={{
        marginBottom: '30px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        borderBottom: '1px outset',
        paddingBottom: '20px',
      }}
    >
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
      <Button variant="contained" startIcon={<ImportExportIcon />} onClick={handleImportGeoList}>
        Import
      </Button>
    </Box>
  );
};

export default CongregationsCountryImport;
