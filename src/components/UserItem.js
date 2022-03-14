import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import BlockIcon from '@mui/icons-material/Block';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GradeIcon from '@mui/icons-material/Grade';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LockResetIcon from '@mui/icons-material/LockReset';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PersonIcon from '@mui/icons-material/Person';
import PowerIcon from '@mui/icons-material/Power';
import SecurityIcon from '@mui/icons-material/Security';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
	adminEmailState,
	adminPasswordState,
	apiHostState,
	usersListState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const UserItem = ({ user }) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const [usersList, setUsersList] = useRecoilState(usersListState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPasswordState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [isEnableUser, setIsEnableUser] = useState(false);
	const [isDisableUser, setIsDisableUser] = useState(false);
	const [isResetPwd, setIsResetPwd] = useState(false);
	const [open, setOpen] = useState(false);
	const [dlgTitle, setDlgTitle] = useState('');
	const [dlgContent, setDlgContent] = useState('');
	const [anchorEl, setAnchorEl] = useState(null);

	const theme = useTheme();
	const miniView = useMediaQuery(theme.breakpoints.down(500), {
		noSsr: true,
	});

	const menuOpen = Boolean(anchorEl);

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
	};

	const handleDlgClose = () => {
		setOpen(false);
	};

	const handleDlgAction = async () => {
		if (isDelete) {
			handleDlgClose();
			await handleDeleteUser();
			setIsDelete(false);
		} else if (isEnableUser || isDisableUser) {
			handleDlgClose();
			await handleAccountStatus();
			setIsEnableUser(false);
			setIsDisableUser(false);
		} else if (isResetPwd) {
			handleDlgClose();
			await handleResetPassword();
			setIsResetPwd(false);
		}
	};

	const handleSetDelete = () => {
		handleMenuClose();
		setDlgTitle('Delete user');
		setDlgContent(`Are you sure to delete the user: ${user.username}?`);
		setIsDelete(true);
		setOpen(true);
	};

	const handleSetStatus = () => {
		handleMenuClose();
		if (user.disabled) {
			setDlgTitle('Enable user');
			setDlgContent(
				`Are you sure to enable the account of the following user: ${user.username}?`
			);
			setIsEnableUser(true);
		} else {
			setDlgTitle('Disable user');
			setDlgContent(
				`Are you sure to disable the account of the following user: ${user.username}? The user will no longer be able to sign in.`
			);
			setIsDisableUser(true);
		}

		setOpen(true);
	};

	const handleSetReset = () => {
		handleMenuClose();
		setDlgTitle('Reset user password');
		setDlgContent(
			`Are you sure to send a password reset link to this user: ${user.username}?`
		);
		setIsResetPwd(true);
		setOpen(true);
	};

	const handleDeleteUser = async () => {
		setIsProcessing(true);
		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			user_email: user.email,
			user_uid: user.uid,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/delete-user`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						let newUsers = usersList.filter(
							(itemUser) => itemUser.uid !== user.uid
						);
						setIsProcessing(false);
						setUsersList(newUsers);
						setAppMessage('User deleted successfully');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else {
						setIsProcessing(false);
						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
				})
				.catch((err) => {
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	const handleAccountStatus = async () => {
		setIsProcessing(true);
		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			user_email: user.email,
			user_uid: user.uid,
		};

		if (apiHost !== '') {
			const uri = `${apiHost}api/admin/${
				isEnableUser ? 'enable-user' : isDisableUser ? 'disable-user' : ''
			}`;
			fetch(uri, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						let item = usersList.find((itemUser) => itemUser.uid === user.uid);

						let newUsers = usersList.filter(
							(itemUser) => itemUser.uid !== user.uid
						);

						let obj = {
							...item,
							disabled: isEnableUser ? false : isDisableUser ? true : true,
						};

						newUsers.push(obj);

						setIsProcessing(false);
						setUsersList(newUsers);
						setAppMessage('User account status updated successfully');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else {
						setIsProcessing(false);
						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
				})
				.catch((err) => {
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	const handleResetPassword = async () => {
		setIsProcessing(true);
		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			user_email: user.email,
			user_username: user.username,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/user-reset-password`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						setIsProcessing(false);
						setAppMessage('Password reset email queued for sending');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else {
						setIsProcessing(false);
						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
				})
				.catch((err) => {
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<>
			<Box>
				{open && (
					<Dialog open={open} onClose={handleDlgClose}>
						<DialogTitle>
							<Typography
								sx={{ fontWeight: 'bold', fontSize: '18px', lineHeight: 1.2 }}
							>
								{dlgTitle}
							</Typography>
						</DialogTitle>
						<DialogContent>
							<Typography sx={{ lineHeight: 1.2 }}>{dlgContent}</Typography>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpen(false)} color='primary'>
								No
							</Button>
							<Button onClick={handleDlgAction} color='primary' autoFocus>
								Yes
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</Box>
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
						<Box
							sx={{
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
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
									<Typography sx={{ fontSize: '12px' }}>
										{user.email}
									</Typography>
								</Box>
							</Box>
							{miniView && (
								<Box>
									{isProcessing && (
										<Container
											sx={{
												display: 'flex',
												justifyContent: 'center',
											}}
										>
											<CircularProgress
												disableShrink
												color='secondary'
												size={'20px'}
											/>
										</Container>
									)}
									{!isProcessing && (
										<>
											<IconButton
												id='more-button-mini'
												aria-controls={menuOpen ? 'basic-menu' : undefined}
												aria-haspopup='true'
												aria-expanded={menuOpen ? 'true' : undefined}
												onClick={handleMenuOpen}
											>
												<MoreVertIcon />
											</IconButton>
											<Menu
												id='demo-positioned-menu'
												aria-labelledby='more-button-mini'
												anchorEl={anchorEl}
												open={menuOpen}
												onClose={handleMenuClose}
												anchorOrigin={{
													vertical: 'top',
													horizontal: 'left',
												}}
												transformOrigin={{
													vertical: 'top',
													horizontal: 'left',
												}}
											>
												<MenuItem
													onClick={handleSetStatus}
													sx={{ minHeight: '25px' }}
												>
													<ListItemIcon>
														<>
															{user.disabled && (
																<PowerIcon sx={{ color: '#311b92' }} />
															)}
															{!user.disabled && (
																<BlockIcon sx={{ color: '#311b92' }} />
															)}
														</>
													</ListItemIcon>
													<ListItemText>
														{user.disabled ? 'Enable' : 'Disable'}
													</ListItemText>
												</MenuItem>
												<MenuItem
													onClick={handleSetReset}
													sx={{ minHeight: '25px' }}
												>
													<ListItemIcon>
														<LockResetIcon sx={{ color: '#bf360c' }} />
													</ListItemIcon>
													<ListItemText>Reset password</ListItemText>
												</MenuItem>
												<MenuItem
													onClick={handleSetDelete}
													sx={{ minHeight: '25px' }}
												>
													<ListItemIcon>
														<DeleteIcon sx={{ color: 'red' }} />
													</ListItemIcon>
													<ListItemText>Delete</ListItemText>
												</MenuItem>
											</Menu>
										</>
									)}
								</Box>
							)}
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
									<Box sx={{ width: '250px' }}>
										<Typography
											sx={{
												fontWeight: 'bold',
												textDecoration: 'underline',
												fontSize: '14px',
											}}
										>
											Congregation
										</Typography>
										{user.cong_name !== '' && (
											<Typography sx={{ fontSize: '14px' }}>
												{user.cong_name} ({user.cong_number})
											</Typography>
										)}
										{user.cong_name === '' && (
											<Typography sx={{ fontSize: '14px' }}>
												Not yet assigned
											</Typography>
										)}
									</Box>

									<Stack direction='row' alignItems='center' spacing={0.5}>
										{user.disabled && <BlockIcon sx={{ color: '#ff5722' }} />}
										{!user.disabled && user.emailVerified && (
											<CheckCircleIcon color='success' />
										)}
										{!user.disabled && !user.emailVerified && (
											<HourglassFullIcon sx={{ color: '#ff5722' }} />
										)}

										<Typography sx={{ fontSize: '14px' }}>
											{user.disabled
												? 'Account disabled'
												: user.emailVerified
												? 'Account verified'
												: 'Need verification'}
										</Typography>
									</Stack>
								</Box>
								<Box>
									{isProcessing && (
										<Container
											sx={{
												display: 'flex',
												justifyContent: 'center',
												marginTop: '25px',
											}}
										>
											<CircularProgress
												disableShrink
												color='secondary'
												size={'20px'}
											/>
										</Container>
									)}
									{!isProcessing && (
										<>
											{user.disabled && (
												<Button
													onClick={handleSetStatus}
													startIcon={<PowerIcon sx={{ color: '#311b92' }} />}
													sx={{
														color: 'black',
														marginLeft: '5px',
														marginTop: '5px',
													}}
													variant='outlined'
												>
													Enable
												</Button>
											)}
											{!user.disabled && (
												<Button
													onClick={handleSetStatus}
													startIcon={<BlockIcon sx={{ color: '#311b92' }} />}
													sx={{
														color: 'black',
														marginLeft: '5px',
														marginTop: '5px',
													}}
													variant='outlined'
												>
													Disable
												</Button>
											)}
											<Button
												onClick={handleSetReset}
												startIcon={<LockResetIcon sx={{ color: '#bf360c' }} />}
												sx={{
													color: 'black',
													marginLeft: '5px',
													marginTop: '5px',
												}}
												variant='outlined'
											>
												Reset pwd
											</Button>
											<Button
												onClick={handleSetDelete}
												startIcon={<DeleteIcon sx={{ color: 'red' }} />}
												sx={{
													color: 'black',
													marginLeft: '5px',
													marginTop: '5px',
												}}
												variant='outlined'
											>
												Delete
											</Button>
										</>
									)}
								</Box>
							</Box>
						)}
					</Box>
				)}
			</Box>
		</>
	);
};

export default UserItem;
