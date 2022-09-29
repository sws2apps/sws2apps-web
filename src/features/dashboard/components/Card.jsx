import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const Card = ({ title, bgColor, Icon, children }) => {
	return (
		<Grid item xs={12} sm={6} md={6} lg={6} xl={4}>
			<Paper
				elevation={3}
				sx={{ height: '250px', padding: '20px', backgroundColor: bgColor }}
			>
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					{Icon}
					<Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>
						{title}
					</Typography>
				</Box>
				{children}
			</Paper>
		</Grid>
	);
};

export default Card;
