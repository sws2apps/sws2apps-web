import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CongregationSelect from './CongregationSelect';
import CountrySelect from './CountrySelect';

const UserCongregationAssign = ({ setTmpUser }) => {
  const [country, setCountry] = useState(null);

  const handleUpdateCongregation = (value) => {
    setTmpUser((prev) => {
      return {
        ...prev,
        cong_name: value === null ? '' : value.congName,
        cong_number: value === null ? '' : value.congNumber,
        cong_country: country === null ? '' : country.code,
      };
    });
  };

  return (
    <Box>
      <Typography sx={{ marginBottom: '15px' }}>This user does not have a congregation yet.</Typography>
      <Box
        sx={{
          width: '100%',
          maxWidth: '500px',
          margin: '30px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <CountrySelect setCountry={(value) => setCountry(value)} />
        {country !== null && (
          <CongregationSelect country={country} setCongregation={(value) => handleUpdateCongregation(value)} />
        )}
      </Box>
    </Box>
  );
};

export default UserCongregationAssign;
