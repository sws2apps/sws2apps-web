import { blue } from '@mui/material/colors';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import GppBadIcon from '@mui/icons-material/GppBad';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Typography from '@mui/material/Typography';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import Card from './components/Card';

const Users = ({ isProcessing }) => {
	const usersSummary = [
		{
			id: 'users-all',
			label: 'All users',
			count: 28,
			icon: <PeopleAltIcon />,
		},
		{
			id: 'users-active',
			label: 'Active users',
			count: 28,
			icon: <VerifiedUserIcon sx={{ color: 'green' }} />,
		},
		{
			id: 'users-pending-mfa',
			label: 'MFA Pending',
			count: 28,
			icon: <GppBadIcon sx={{ color: 'red' }} />,
		},
		{
			id: 'users-unverified',
			label: 'Unverified users',
			count: 28,
			icon: <HourglassFullIcon sx={{ color: 'purple' }} />,
		},
	];

	return (
		<Card
			title='Users'
			bgColor={blue[100]}
			Icon={<PeopleAltIcon className='card-icon' />}
		>
			{isProcessing && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						height: '65%',
					}}
				>
					<CircularProgress color='secondary' size={40} disableShrink={true} />
				</Box>
			)}
			{!isProcessing && (
				<Box sx={{ marginTop: '20px' }}>
					{usersSummary.map((summary) => (
						<Box
							key={summary.id}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '5px',
							}}
						>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								{summary.icon}
								<Typography sx={{ marginLeft: '5px' }}>
									{summary.label}
								</Typography>
							</Box>
							<Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>
								{summary.count}
							</Typography>
						</Box>
					))}
				</Box>
			)}
		</Card>
	);
};

export default Users;
