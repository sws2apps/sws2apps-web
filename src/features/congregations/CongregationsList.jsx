import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { fileDialog } from 'file-select-dialog';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { rootModalOpenState } from '../../states/main';
import { handleAdminLogout } from '../../utils/admin';
import { congFormatImport } from '../../utils/congregation';
import { apiCongregationsBulkAdd, apiFetchCountries } from '../../utils/api';
import CongregationCountryCard from './CongregationCountryCard';

const CongregationsList = ({ geo_id }) => {
  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setOpenModal = useSetRecoilState(rootModalOpenState);

  const query = queryClient.getQueryData(['countries']);
  const country = query?.data.find((country) => country.id === geo_id);

  const [language, setLanguage] = useState('E');

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleClearAdmin = useCallback(async () => {
    await handleAdminLogout();
  }, []);

  const handleImportCongList = async () => {
    try {
      const file = await fileDialog({
        accept: '.json',
        strict: true,
      });

      setOpenModal(true);
      const cong_list = await congFormatImport(file);

      const { status, data } = await apiCongregationsBulkAdd(geo_id, cong_list, language);

      if (status === 200) {
        await queryClient.prefetchQuery({
          queryKey: ['countries'],
          queryFn: apiFetchCountries,
        });

        setAppMessage('Congregations imported successfully');
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
    <Box sx={{ marginTop: '20px' }}>
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
        <Button variant="contained" startIcon={<ImportExportIcon />} onClick={handleImportCongList}>
          Import
        </Button>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2}>
          {country?.congregations &&
            country.congregations.length > 0 &&
            country.congregations.map((congregation) => (
              <CongregationCountryCard key={congregation.id} cong={congregation} />
            ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default CongregationsList;
