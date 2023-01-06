import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const CongregationCountryCard = ({ cong }) => {
  return (
    <Grid item xs={12} sm={6} lg={4}>
      <Paper elevation={8}>
        <Box sx={{ padding: '10px', display: 'flex', gap: '10px' }}>
          <HomeWorkIcon color="secondary" sx={{ fontSize: '40px' }} />
          <Box>
            <Box sx={{ height: '70px' }}>
              <Typography>{cong.name?.E}</Typography>
              <Typography>{cong.number}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
              <Chip label={cong.language} />
              {cong.active && <Chip color="success" label="Active" />}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );
};

export default CongregationCountryCard;
