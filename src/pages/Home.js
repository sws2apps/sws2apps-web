import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import AppListItem from '../components/AppListItem';

const Home = () => {
	return (
		<Box>
			<Typography sx={{ fontSize: '24px', fontWeight: 'bold', color: '#00F' }}>
				Applications List
			</Typography>
			<Typography sx={{}}>
				Find below all applications that we have built, or in process of being
				developped
			</Typography>
			<Box
				sx={{
					marginTop: '20px',
					backgroundColor: '#AED6F1',
					borderRadius: '10px',
					padding: '10px',
					boxShadow: '0px 2px #888888',
				}}
			>
				<Grid container spacing={{ xs: 2, md: 3 }}>
					<AppListItem
						name='Life and Ministry Meeting Overseer Assistant'
						desc='This application is designed for use by the Life and Ministry Meeting Overseer. It will help him to schedule the student assignments for the midweek meeting.'
						github='lmm-oa-sws'
					/>
					<AppListItem
						name='Meeting Schedule Creator'
						desc='This application is designed for use by the Coordinator. It will help him to schedule the midweek meeting part, other than the student assignments, and the weekend meeting.'
					/>
					<AppListItem
						name='SWS Pocket'
						desc='This application is designed for use by students for midweek meeting and publishers. It will help them to see the midweek and weekend meeting schedule. Publishers will be able to submit their monthly field service report as well.'
						github='sws-pocket'
					/>
					<AppListItem
						name='Secretary Tools Report Organizer'
						desc='This application is designed for use by the Congregation Secretary. It will help him to organize and manage the various reports for the congregation.'
					/>
					<AppListItem
						name='SWS VIP'
						desc='This application is designed for use by appointed brothers in the congregation. Various tasks according to their role will be available for them in the app.'
					/>
				</Grid>
			</Box>
		</Box>
	);
};

export default Home;
