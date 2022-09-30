import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import AddModeratorIcon from '@mui/icons-material/AddModerator';
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
import GppBadIcon from '@mui/icons-material/GppBad';
import GppGoodIcon from '@mui/icons-material/GppGood';
import GradeIcon from '@mui/icons-material/Grade';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonIcon from '@mui/icons-material/Person';
import PowerIcon from '@mui/icons-material/Power';
import SecurityIcon from '@mui/icons-material/Security';
import Stack from '@mui/material/Stack';
import TokenIcon from '@mui/icons-material/Token';
import Typography from '@mui/material/Typography';
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	apiHostState,
	visitorIDState,
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
	const visitorID = useRecoilValue(visitorIDState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [isEnableUser, setIsEnableUser] = useState(false);
	const [isDisableUser, setIsDisableUser] = useState(false);
	const [isResetPwd, setIsResetPwd] = useState(false);
	const [open, setOpen] = useState(false);
	const [dlgTitle, setDlgTitle] = useState('');
	const [dlgContent, setDlgContent] = useState('');
	const [isRevoke, setIsRevoke] = useState(false);
	const [isMakeUserAdmin, setIsMakeUserAdmin] = useState(false);

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleDlgClose = () => {
		setIsDelete(false);
		setIsEnableUser(false);
		setIsDisableUser(false);
		setIsResetPwd(false);
		setIsRevoke(false);
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
		} else if (isRevoke) {
			handleDlgClose();
			await handleRevokeToken();
			setIsResetPwd(false);
		} else if (isMakeUserAdmin) {
			handleDlgClose();
			await handleMakeUserAdmin();
			setIsMakeUserAdmin(false);
		}
	};

	const handleSetAdmin = () => {
		setDlgTitle('Make user as administrator');
		setDlgContent(
			`Are you sure to set as admin the following user: ${user.username}?`
		);
		setIsMakeUserAdmin(true);
		setOpen(true);
	};

	const handleSetDelete = () => {
		setDlgTitle('Delete user');
		setDlgContent(`Are you sure to delete the user: ${user.username}?`);
		setIsDelete(true);
		setOpen(true);
	};

	const handleSetStatus = () => {
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
		setDlgTitle('Reset user password');
		setDlgContent(
			`Are you sure to send a password reset link to this user: ${user.username}?`
		);
		setIsResetPwd(true);
		setOpen(true);
	};

	const handleSetRevoke = () => {
		setDlgTitle('Revoke MFA token');
		setDlgContent(
			`Are you sure to revoke the MFA token this user: ${user.username}?`
		);
		setIsRevoke(true);
		setOpen(true);
	};

	const handleDeleteUser = async () => {
		setIsProcessing(true);

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/users/${user.id}`, {
				signal: abortCont.signal,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					email: adminEmail,
					visitorid: visitorID,
				},
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						let newUsers = usersList.filter(
							(itemUser) => itemUser.id !== user.id
						);
						setIsProcessing(false);
						setUsersList(newUsers);
						setAppMessage('User deleted successfully');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else if (res.status === 403) {
						handleClearAdmin();
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

		if (apiHost !== '') {
			const uri = `${apiHost}api/admin/users/${user.id}/${
				isEnableUser ? 'enable' : isDisableUser ? 'disable' : ''
			}`;
			fetch(uri, {
				signal: abortCont.signal,
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					email: adminEmail,
					visitorid: visitorID,
				},
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						let item = usersList.find((itemUser) => itemUser.id === user.id);

						let newUsers = usersList.filter(
							(itemUser) => itemUser.id !== user.id
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
					} else if (res.status === 403) {
						handleClearAdmin();
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

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/users/${user.id}/reset-password`, {
				signal: abortCont.signal,
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
					email: adminEmail,
					visitorid: visitorID,
				},
			})
				.then(async (res) => {
					const data = await res.json();
					if (res.status === 200) {
						setIsProcessing(false);
						setAppMessage('Password reset email queued for sending');
						setAppSeverity('success');
						setAppSnackOpen(true);
					} else if (res.status === 403) {
						handleClearAdmin();
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

	const handleRevokeToken = async () => {
		setIsProcessing(true);
		try {
			if (apiHost !== '') {
				const res = await fetch(
					`${apiHost}api/admin/users/${user.id}/revoke-token`,
					{
						signal: abortCont.signal,
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							email: adminEmail,
							visitorid: visitorID,
						},
					}
				);

				const data = await res.json();
				if (res.status === 200) {
					setIsProcessing(false);
					setAppMessage('User MFA token revoked successfully');
					setAppSeverity('success');
					setAppSnackOpen(true);

					if (adminEmail === user.user_uid) {
						await handleClearAdmin();
					}
				} else if (res.status === 403) {
					handleClearAdmin();
				} else {
					setIsProcessing(false);
					setAppMessage(data.message);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
			}
		} catch (err) {
			setIsProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	const handleMakeUserAdmin = async () => {
		setIsProcessing(true);
		try {
			if (apiHost !== '') {
				const res = await fetch(
					`${apiHost}api/admin/users/${user.id}/make-admin`,
					{
						signal: abortCont.signal,
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							email: adminEmail,
							visitorid: visitorID,
						},
					}
				);

				const data = await res.json();
				if (res.status === 200) {
					let item = usersList.find((itemUser) => itemUser.id === user.id);

					let newUsers = usersList.filter(
						(itemUser) => itemUser.id !== user.id
					);

					let obj = {
						...item,
						global_role: 'admin',
					};

					newUsers.push(obj);

					setIsProcessing(false);
					setUsersList(newUsers);
					setAppMessage('User account status set as admin successfully');
					setAppSeverity('success');
					setAppSnackOpen(true);
				} else if (res.status === 403) {
					handleClearAdmin();
				} else {
					setIsProcessing(false);
					setAppMessage(data.message);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
			}
		} catch (err) {
			setIsProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
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
					minWidth: '450px',
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
												: '#5B2C6F'
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
										{user.user_uid}
									</Typography>
								</Box>
							</Box>
						</Box>
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

								<Box>
									<Stack direction='row' alignItems='center' spacing={0.5}>
										{user.disabled && <BlockIcon sx={{ color: '#ff5722' }} />}
										{!user.disabled && user.global_role !== 'pocket' && (
											<>
												{user.emailVerified && (
													<CheckCircleIcon color='success' />
												)}
												{!user.emailVerified && (
													<HourglassFullIcon sx={{ color: '#ff5722' }} />
												)}
											</>
										)}

										{user.global_role === 'pocket' && user.disabled && (
											<Typography sx={{ fontSize: '14px' }}>
												Account disabled
											</Typography>
										)}

										{user.global_role !== 'pocket' && (
											<Typography sx={{ fontSize: '14px' }}>
												{user.disabled
													? 'Account disabled'
													: user.emailVerified
													? 'Account verified'
													: 'Need verification'}
											</Typography>
										)}
									</Stack>
									<Stack direction='row' alignItems='center' spacing={0.5}>
										{user.mfaEnabled && (
											<GppGoodIcon sx={{ color: '#D35400' }} />
										)}
										{!user.mfaEnabled && (
											<GppBadIcon sx={{ color: '#515A5A' }} />
										)}

										<Typography sx={{ fontSize: '14px' }}>
											{user.mfaEnabled ? 'MFA enabled' : 'MFA pending'}
										</Typography>
									</Stack>
								</Box>
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
										{user.global_role === 'vip' &&
											!user.disabled &&
											user.emailVerified &&
											user.mfaEnabled && (
												<Button
													onClick={handleSetAdmin}
													startIcon={
														<AddModeratorIcon sx={{ color: '#E74C3C' }} />
													}
													sx={{
														color: 'black',
														marginLeft: '5px',
														marginTop: '5px',
													}}
													variant='outlined'
												>
													Make as admin
												</Button>
											)}

										<Button
											onClick={handleSetRevoke}
											startIcon={<TokenIcon sx={{ color: '#D35400' }} />}
											sx={{
												color: 'black',
												marginLeft: '5px',
												marginTop: '5px',
											}}
											variant='outlined'
										>
											Revoke token
										</Button>
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
										{user.global_role !== 'pocket' && (
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
										)}
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
					</Box>
				)}
			</Box>
		</>
	);
};

export default UserItem;
