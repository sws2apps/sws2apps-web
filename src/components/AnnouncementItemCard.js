import { useNavigate } from 'react-router-dom';
import dateFormat from 'dateformat';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Typography from '@mui/material/Typography';
import VisibilityIcon from '@mui/icons-material/Visibility';

const AnnouncementItemCard = ({ announcement, isLocked }) => {
	let navigate = useNavigate();

	const getDate = (varDate) => {
		const day = varDate.split('/')[1];
		const month = varDate.split('/')[0];
		const year = varDate.split('/')[2];
		var result = new Date(year, +month - 1, day);
		return dateFormat(result, 'mmmm dd, yyyy');
	};

	const handleViewAnnouncement = () => {
		navigate(`/administration/announcements/${announcement.id}`);
	};

	return (
		<Box
			sx={{
				width: '400px',
				margin: '10px',
				padding: '10px 10px',
				borderRadius: '8px',
				boxShadow: '0 3px 5px 2px rgba(23, 32, 42, .3)',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<NotificationsIcon sx={{ fontSize: '30px', color: '#D35400' }} />
				<Typography
					color='primary'
					sx={{ fontWeight: 'bold', lineHeight: 1.2, marginLeft: '5px' }}
				>
					{announcement.title}
				</Typography>
			</Box>
			<Box sx={{ height: '60px' }}>
				<Typography
					sx={{ lineHeight: 1.2, marginTop: '10px', marginLeft: '35px' }}
				>
					{announcement.desc}
				</Typography>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<IconButton onClick={handleViewAnnouncement} disabled={isLocked}>
					<VisibilityIcon />
				</IconButton>

				<Box>
					<Typography
						sx={{
							fontStyle: 'italic',
							fontSize: '12px',
							textAlign: 'right',
						}}
						gutterBottom={false}
					>
						{announcement.publishedDate
							? `Published on ${getDate(announcement.publishedDate)}`
							: 'Draft, not published yet'}
					</Typography>
					<Typography
						sx={{
							fontStyle: 'italic',
							fontSize: '12px',
							textAlign: 'right',
						}}
					>
						{`Expired on ${getDate(announcement.expiredDate)}`}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default AnnouncementItemCard;
