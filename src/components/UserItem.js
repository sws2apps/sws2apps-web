import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import BlockIcon from '@mui/icons-material/Block';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import GradeIcon from '@mui/icons-material/Grade';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const UserItem = ({ user }) => {
	const theme = useTheme();
	const miniView = useMediaQuery(theme.breakpoints.down(500), {
		noSsr: true,
	});

	return (
		<Box
			sx={{
				width: '100%',
				backgroundColor: '#AED6F1',
				borderRadius: '10px',
				padding: '10px',
				marginBottom: '15px',
			}}
		>
			{user && (
				<Box>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							sx={{
								backgroundColor: `${
									user.global_role === 'admin'
										? 'red'
										: user.global_role === 'vip'
										? 'green'
										: ''
								}`,
							}}
						>
							{user.global_role === 'admin' ? (
								<SecurityIcon />
							) : user.global_role === 'vip' ? (
								<GradeIcon />
							) : (
								<PersonIcon />
							)}
						</Avatar>
						<Box sx={{ marginLeft: '10px' }}>
							<Typography sx={{ fontWeight: 'bold' }}>
								{user.username}
							</Typography>
							<Typography sx={{ fontSize: '12px' }}>{user.email}</Typography>
						</Box>
					</Box>
					{!miniView && (
						<Box
							sx={{
								borderTop: '2px solid #BFC9CA',
								marginTop: '10px',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-start',
								flexWrap: 'wrap',
							}}
						>
							<Box
								sx={{
									marginTop: '10px',
									display: 'flex',
									alignItems: 'flex-start',
								}}
							>
								{user.cong_name !== '' && (
									<Box sx={{ marginRight: '40px' }}>
										<Typography
											sx={{
												fontWeight: 'bold',
												textDecoration: 'underline',
												fontSize: '14px',
											}}
										>
											Congregation
										</Typography>
										<Typography sx={{ fontSize: '14px' }}>
											{user.cong_name} ({user.cong_number})
										</Typography>
									</Box>
								)}
								<Stack direction='row' alignItems='center' spacing={0.5}>
									{user.emailVerified && <CheckCircleIcon color='success' />}
									{!user.emailVerified && (
										<HourglassFullIcon sx={{ color: '#ff5722' }} />
									)}
									<Typography sx={{ fontSize: '14px' }}>
										{user.emailVerified
											? 'Account verified'
											: 'Need verification'}
									</Typography>
								</Stack>
							</Box>
							<Box>
								<Button
									startIcon={<BlockIcon sx={{ color: '#311b92' }} />}
									sx={{ color: 'black', marginLeft: '5px', marginTop: '5px' }}
									variant='outlined'
								>
									Disable account
								</Button>
								<Button
									startIcon={<LockResetIcon sx={{ color: '#bf360c' }} />}
									sx={{ color: 'black', marginLeft: '5px', marginTop: '5px' }}
									variant='outlined'
								>
									Reset password
								</Button>
								<Button
									startIcon={<DeleteIcon sx={{ color: 'red' }} />}
									sx={{ color: 'black', marginLeft: '5px', marginTop: '5px' }}
									variant='outlined'
								>
									Delete
								</Button>
							</Box>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
};

export default UserItem;
