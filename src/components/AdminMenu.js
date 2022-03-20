import { Link } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ApiIcon from '@mui/icons-material/Api';
import Box from '@mui/material/Box';
import HouseIcon from '@mui/icons-material/House';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import Typography from '@mui/material/Typography';

const AdminMenu = () => {
	return (
		<Box
			sx={{
				minWidth: '280px',
				marginRight: '15px',
			}}
		>
			<Typography
				align='center'
				sx={{
					backgroundColor: '#4A235A',
					padding: '10px',
					borderRadius: '10px',
					color: 'white',
					fontWeight: 'bold',
				}}
			>
				Administration Pannel
			</Typography>
			<List>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<PendingActionsIcon />
						</ListItemIcon>
						<ListItemText primary='Congregation requests' />
					</ListItemButton>
				</ListItem>
				<ListItem
					disablePadding
					button
					component={Link}
					to='/administration/users'
				>
					<ListItemButton>
						<ListItemIcon>
							<AccountCircleIcon />
						</ListItemIcon>
						<ListItemText primary='Users' />
					</ListItemButton>
				</ListItem>
				<ListItem
					disablePadding
					button
					component={Link}
					to='/administration/congregation'
				>
					<ListItemButton>
						<ListItemIcon>
							<HouseIcon />
						</ListItemIcon>
						<ListItemText primary='Congregations' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<ApiIcon />
						</ListItemIcon>
						<ListItemText primary='Blocked API requests' />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	);
};

export default AdminMenu;
