import BlockIcon from '@mui/icons-material/Block';
import CampaignIcon from '@mui/icons-material/Campaign';
import Divider from '@mui/material/Divider';
import FlagIcon from '@mui/icons-material/Flag';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import MailIcon from '@mui/icons-material/Mail';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import SendIcon from '@mui/icons-material/Send';

const AppMenus = () => {
	return (
		<>
			<List
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						Applications
					</ListSubheader>
				}
			>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<CampaignIcon />
						</ListItemIcon>
						<ListItemText primary='Announcements' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<FlagIcon />
						</ListItemIcon>
						<ListItemText primary='Feature Flags' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<BlockIcon />
						</ListItemIcon>
						<ListItemText primary='Blocked IP' />
					</ListItemButton>
				</ListItem>
				<Divider />
			</List>
			<List
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						Users
					</ListSubheader>
				}
			>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<PeopleAltIcon />
						</ListItemIcon>
						<ListItemText primary='List' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<SendIcon />
						</ListItemIcon>
						<ListItemText primary='Send Email' />
					</ListItemButton>
				</ListItem>
				<Divider />
			</List>
			<List
				aria-labelledby='nested-list-subheader'
				subheader={
					<ListSubheader component='div' id='nested-list-subheader'>
						Congregations
					</ListSubheader>
				}
			>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<HomeWorkIcon />
						</ListItemIcon>
						<ListItemText primary='List' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<PlaylistAddIcon />
						</ListItemIcon>
						<ListItemText primary='Requests' />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon sx={{ minWidth: '40px', width: '40px' }}>
							<SendIcon />
						</ListItemIcon>
						<ListItemText primary='Send Email' />
					</ListItemButton>
				</ListItem>
				<Divider />
			</List>
		</>
	);
};

export default AppMenus;
