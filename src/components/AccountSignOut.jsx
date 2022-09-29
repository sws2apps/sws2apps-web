import { useState } from 'react'
import { deepPurple } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

const AccountSignOut = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);
  	const open = Boolean(anchorEl);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
			<IconButton
            	onClick={handleClick}
            	size="small"
            	sx={{ ml: 2 }}
            	aria-controls={open ? 'account-menu' : undefined}
            	aria-haspopup="true"
            	aria-expanded={open ? 'true' : undefined}
          	>
            <Avatar sx={{ width: 32, height: 32, bgcolor: deepPurple[500], }}>S</Avatar>
          </IconButton>
		</Box>
	);
};

export default AccountSignOut;
