import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiFetchCountries } from '../../utils/api';
import CongregationsCountryImport from './CongregationsCountryImport';
import CongregationsList from './CongregationsList';

const CongregationsCountry = () => {
  const queryClient = useQueryClient();

  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = countries.map((country) => {
    return { id: country.id, name: country.name.E, code: country.code };
  });

  const handleOnChange = (value) => {
    setSelected(value);
  };

  useEffect(() => {
    let active = true;

    if (!isLoading) {
      return undefined;
    }

    const fetchCongregations = async () => {
      setIsLoading(true);
      await queryClient.prefetchQuery({
        queryKey: ['countries'],
        queryFn: apiFetchCountries,
      });
      const tmpCountries = queryClient.getQueryData(['countries']);

      if (active) {
        setCountries(tmpCountries.data);
      }

      setIsLoading(false);
    };

    fetchCongregations();

    return () => {
      active = false;
    };
  }, [isLoading, queryClient]);

  useEffect(() => {
    if (openPicker) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [countries, openPicker]);

  return (
    <Box>
      <CongregationsCountryImport />
      <Autocomplete
        id="asynchronous-demo"
        fullWidth={true}
        sx={{ maxWidth: '900px' }}
        size="small"
        open={openPicker}
        onOpen={() => {
          setOpenPicker(true);
        }}
        onClose={() => {
          setOpenPicker(false);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        options={options}
        loading={isLoading}
        value={selected}
        onChange={(e, value) => handleOnChange(value)}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <EditLocationIcon sx={{ marginRight: '8px' }} />
            {option.name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Select a country"
            InputProps={{
              ...params.InputProps,
              startAdornment: <EditLocationIcon sx={{ marginLeft: '5px' }} />,
              endAdornment: (
                <>
                  {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
      {selected && selected.id && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography>List of congregations:</Typography>
          <CongregationsList geo_id={selected.id} />
        </Box>
      )}
    </Box>
  );
};

export default CongregationsCountry;
