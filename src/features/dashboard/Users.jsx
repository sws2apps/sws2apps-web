import { blue } from '@mui/material/colors';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import GppBadIcon from '@mui/icons-material/GppBad';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Typography from '@mui/material/Typography';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import Card from './components/Card';

const Users = ({ isProcessing, failedFetch, usersData }) => {
	const usersSummary = [
		{
			id: 'users-all',
			label: 'All users',
			count: usersData.total,
			icon: <PeopleAltIcon />,
		},
		{
			id: 'users-active',
			label: 'Active users',
			count: usersData.active,
			icon: <VerifiedUserIcon sx={{ color: 'green' }} />,
		},
		{
			id: 'users-pocket',
			label: 'Pocket users',
			count: usersData.pockets,
			icon: <AccountCircleIcon sx={{ color: 'green' }} />,
		},
		{
			id: 'users-pending-mfa',
			label: 'MFA Pending',
			count: usersData.mfaPending,
			icon: <GppBadIcon sx={{ color: 'red' }} />,
		},
		{
			id: 'users-unverified',
			label: 'Unverified users',
			count: usersData.unverified,
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
			{!isProcessing && failedFetch && (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
						height: '65%',
					}}
				>
					<ErrorIcon color='error' sx={{ fontSize: '40px' }} />
					<Typography sx={{ fontSize: '14px' }}>
						An error occured while getting users information
					</Typography>
				</Box>
			)}
			{!isProcessing && !failedFetch && (
				<Box sx={{ marginTop: '10px' }}>
					{usersSummary.map((summary) => (
						<Box
							key={summary.id}
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
								marginBottom: '2px',
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
