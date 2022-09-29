import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { deepPurple } from '@mui/material/colors';

const AccountSignOut = () => {
	return (
		<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
			<Avatar
				sx={{
					bgcolor: deepPurple[500],
					cursor: 'pointer',
					'&:hover': { boxShadow: 'inset 0 0 0 2px #D7DBDD' },
				}}
			>
				S
			</Avatar>
		</Box>
	);
};

export default AccountSignOut;
