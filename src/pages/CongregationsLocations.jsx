import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CongregationsCountry } from '../features/congregations';

const CongregationsLocations = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ textTransform: 'uppercase', lineHeight: 1.3 }}>
        {`Congregations by Geo Locations`}
      </Typography>

      <Box sx={{ marginTop: '20px' }}>
        <CongregationsCountry />
      </Box>
    </Box>
  );
};

export default CongregationsLocations;
