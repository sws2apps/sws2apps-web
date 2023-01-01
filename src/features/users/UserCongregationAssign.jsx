import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiFetchCongregations } from '../../utils/api';

const UserCongregationAssign = ({ tmpUser, setTmpUser }) => {
  const queryClient = useQueryClient();

  const [congregations, setCongregations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openPicker, setOpenPicker] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = congregations.map((congregation) => {
    return { id: congregation.id, cong_name: congregation.cong_name, cong_number: congregation.cong_number };
  });

  const handleOnChange = (value) => {
    setSelected(value);
    setTmpUser((prev) => {
      return { ...prev, cong_id: value.id, cong_name: value.cong_name, cong_number: value.cong_number };
    });
  };

  useEffect(() => {
    if (tmpUser.cong_id === '') {
      setSelected(null);
      return;
    }

    if (options.length > 0) {
      const find = options.find((congregation) => congregation.id === tmpUser.cong_id);
      setSelected(find);
    }
  }, [tmpUser.cong_id, options]);

  useEffect(() => {
    let active = true;

    if (!isLoading) {
      return undefined;
    }

    const fetchCongregations = async () => {
      setIsLoading(true);
      let tmpCongregations = queryClient.getQueryData(['congregations']);
      if (tmpCongregations === undefined) {
        await queryClient.prefetchQuery({
          queryKey: ['congregations'],
          queryFn: apiFetchCongregations,
        });
        tmpCongregations = queryClient.getQueryData(['congregations']);
      }

      if (active) {
        setCongregations(tmpCongregations);
      }

      setIsLoading(false);
    };

    fetchCongregations();

    return () => {
      active = false;
    };
  }, [isLoading, queryClient]);

  useEffect(() => {
    if (!openPicker) {
      setIsLoading(true);
    }
  }, [openPicker]);

  return (
    <Box>
      <Typography sx={{ marginBottom: '15px' }}>This user does not have a congregation yet.</Typography>
      <Autocomplete
        id="asynchronous-demo"
        sx={{ width: 320 }}
        size="medium"
        open={openPicker}
        onOpen={() => {
          setOpenPicker(true);
        }}
        onClose={() => {
          setOpenPicker(false);
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => `(${option.cong_number}) ${option.cong_name}`}
        options={options}
        loading={isLoading}
        value={selected}
        onChange={(e, value) => handleOnChange(value)}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <HomeWorkIcon color="secondary" sx={{ marginRight: '8px' }} />({option.cong_number}) {option.cong_name}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Assign a congregation"
            InputProps={{
              ...params.InputProps,
              startAdornment: <HomeWorkIcon color="secondary" sx={{ marginLeft: '5px' }} />,
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
    </Box>
  );
};

export default UserCongregationAssign;
