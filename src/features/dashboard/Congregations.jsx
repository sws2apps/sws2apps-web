import { green } from '@mui/material/colors';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorIcon from '@mui/icons-material/Error';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import PendingIcon from '@mui/icons-material/Pending';
import Typography from '@mui/material/Typography';
import Card from './components/Card';

const iconsProps = { fontSize: '40px', marginRight: '10px' };

const Congregations = ({ congsData, failedFetch, isProcessing }) => {
	const congregationsSummary = [
		{
			id: 'cong-requests',
			label: 'Pending Requests',
			count: congsData.requests,
			icon: <PendingIcon sx={{ color: 'blue', ...iconsProps }} />,
		},
		{
			id: 'cong-active',
			label: 'Active Congregations',
			count: congsData.active,
			icon: <HomeWorkIcon sx={{ color: 'green', ...iconsProps }} />,
		},
	];

	return (
		<Card
			title='Congregations'
			bgColor={green[100]}
			Icon={<HomeWorkIcon className='card-icon' />}
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
						height: '65%',
					}}
				>
					<ErrorIcon color='error' sx={{ fontSize: '40px' }} />
					<Typography sx={{ fontSize: '14px' }}>
						An error occured while getting congregations information
					</Typography>
				</Box>
			)}
			{!isProcessing && !failedFetch && (
				<Box
					sx={{
						marginTop: '30px',
						display: 'flex',
						justifyContent: 'space-between',
						flexWrap: 'wrap',
						gap: '10px',
					}}
				>
					{congregationsSummary.map((summary) => (
						<Box
							key={summary.id}
							sx={{
								display: 'flex',
								flexDirection: 'column',
								marginBottom: '5px',
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
								}}
							>
								{summary.icon}
								<Box>
									<Typography>{summary.label}</Typography>
									<Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>
										{summary.count}
									</Typography>
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Card>
	);
};

export default Congregations;
