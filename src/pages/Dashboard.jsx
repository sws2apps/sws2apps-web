import Grid from '@mui/material/Grid';
import { Congregations, Users } from '../features/dashboard';

const Dashboard = () => {
	return (
		<Grid
			container
			spacing={2}
			sx={{ marginLeft: { xs: '-11px', sm: '-16px' } }}
		>
			<Users isProcessing={true} />
			<Congregations isProcessing={true} />
		</Grid>
	);
};

export default Dashboard;
