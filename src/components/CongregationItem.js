import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Avatar from '@mui/material/Avatar';
import BlockIcon from '@mui/icons-material/Block';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ErrorIcon from '@mui/icons-material/Error';
import GradeIcon from '@mui/icons-material/Grade';
import Grid from '@mui/material/Grid';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import HouseIcon from '@mui/icons-material/House';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	adminEmailState,
	adminPwdState,
	apiHostState,
	connectionIdState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const CongregationItem = ({ cong }) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPwdState);
	const cnID = useRecoilValue(connectionIdState);

	const [admins, setAdmins] = useState(cong.admin);
	const vips = useState(cong.vip);
	const pockets = useState(cong.pocket);

	const [open, setOpen] = useState(false);
	const [isFetch, setIsFetch] = useState(false);
	const [isError, setIsError] = useState(false);
	const [dlgTitle, setDlgTitle] = useState('');
	const [isAdminAdd, setIsAdminAdd] = useState(false);
	const [isVipAdd, setIsVipAdd] = useState(false);
	const [isPocketAdd, setIsPocketAdd] = useState(false);
	const [varText, setVarText] = useState('');
	const [user, setUser] = useState(undefined);
	const [isSearch, setIsSearch] = useState(false);
	const [isYesDisabled, setIsYesDisabled] = useState(true);
	const [isSearchDisabled, setIsSearchDisable] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [isDeleteAdmin, setIsDeleteAdmin] = useState(false);
	const [isDeleteVip, setIsDeleteVip] = useState(false);
	const { setState: setIsDeletePocket } = useState(false);
	const [toBeDel, setToBeDel] = useState('');

	const handleDlgClose = () => {
		setIsAdminAdd(false);
		setIsVipAdd(false);
		setIsPocketAdd(false);
		setIsDelete(false);
		setIsDeleteAdmin(false);
		setIsDeleteVip(false);
		setIsDeletePocket(false);
		setOpen(false);
	};

	const handleSetIsDeleteAdmin = (username) => {
		setToBeDel(username);
		setDlgTitle(`Remove ${username} from congregation?`);
		setIsDelete(true);
		setIsDeleteAdmin(true);
		setIsYesDisabled(false);
		setOpen(true);
	};

	// const handleSetIsDeleteVip = (username) => {
	// 	setToBeDel(username);
	// 	setDlgTitle(`Remove ${username} from congregation?`);
	// 	setIsDelete(true);
	// 	setIsDeleteVip(true);
	// 	setIsYesDisabled(false);
	// 	setOpen(true);
	// };

	// const handleSetIsDeletePocket = (username) => {
	// 	setToBeDel(username);
	// 	setDlgTitle(`Remove ${username} from congregation?`);
	// 	setIsDelete(true);
	// 	setIsDeletePocket(true);
	// 	setIsYesDisabled(false);
	// 	setOpen(true);
	// };

	const handleSetAdminAdd = () => {
		setDlgTitle(`Add Administrator to ${cong.cong_name}`);
		setIsAdminAdd(true);
		setOpen(true);
	};

	const handleSetVipAdd = async () => {
		setDlgTitle(`Add VIP user to ${cong.cong_name}`);
		setIsVipAdd(true);
		setOpen(true);
	};

	const handleSetPocketAdd = () => {
		setDlgTitle(`Add Pocket user to ${cong.cong_name}`);
		setIsPocketAdd(true);
		setOpen(true);
	};

	const handleDlgAction = async () => {
		setOpen(false);
		if (isAdminAdd) {
			await handleAddAdmin();
			setIsAdminAdd(false);
		} else if (isDelete) {
			if (isDeleteAdmin) {
				await handleDeleteUser(toBeDel, 'admin');
				setIsDeleteAdmin(false);
			} else if (isDeleteVip) {
				await handleDeleteUser(toBeDel, 'vip');
				setIsDeleteVip(false);
			}
			setIsDelete(false);
		}
	};

	const handleAddAdmin = async () => {
		setIsProcessing(true);

		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			cong_id: cong.cong_id,
			user_email: user.email,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/congregation-add-admin`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					cn_uid: cnID,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					if (res.status === 200) {
						let newAdmins = [];
						newAdmins = admins.map((x) => x);

						let obj = {
							name: user.username,
							email: user.email,
						};

						newAdmins.push(obj);
						setAdmins(newAdmins);
					} else {
						const data = await res.json();

						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
					setIsProcessing(false);
				})
				.catch((err) => {
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	const handleDeleteUser = async (email, type) => {
		setIsProcessing(true);

		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			user_email: email,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/congregation-remove-user`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					cn_uid: cnID,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					if (res.status === 200) {
						if (type === 'admin') {
							let newAdmins = [];
							newAdmins = admins.filter((admin) => admin.email !== email);
							setAdmins(newAdmins);
						}
					} else {
						const data = await res.json();

						setAppMessage(data.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
					setIsProcessing(false);
				})
				.catch((err) => {
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	const findUser = async () => {
		setIsSearch(true);
		setIsError(false);
		setIsFetch(true);
		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/get-users`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					cn_uid: cnID,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					if (res.status === 200) {
						const users = await res.json();

						if (isAdminAdd || isVipAdd) {
							const findUser = users.find(
								(user) =>
									user.email === varText &&
									user.global_role !== 'admin' &&
									user.cong_name === ''
							);
							if (
								findUser?.disabled === false &&
								findUser?.emailVerified === true
							) {
								setIsYesDisabled(false);
							} else {
								setIsYesDisabled(true);
							}
							setUser(findUser);
						} else if (isPocketAdd) {
							const findUser = users.find(
								(user) =>
									user.pocket_id === varText &&
									user.global_role === 'pocket' &&
									user.cong_name === ''
							);
							if (
								findUser?.disabled === false &&
								findUser?.emailVerified === true
							) {
								setIsYesDisabled(false);
							} else {
								setIsYesDisabled(true);
							}
							setUser(findUser);
						}
					} else {
						setIsError(true);
					}
					setIsFetch(false);
				})
				.catch((err) => {
					setIsError(true);
					setIsFetch(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	};

	useEffect(() => {
		if (varText.length === 0) {
			setIsSearchDisable(true);
		} else {
			setIsSearchDisable(false);
		}
	}, [varText]);

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
						<DialogContent sx={{ paddingTop: '15px !important' }}>
							{isDelete && (
								<Typography>Are you sure to delete this user?</Typography>
							)}
							{!isDelete && (
								<>
									<Box sx={{ display: 'flex' }}>
										<TextField
											id='outlined-identifier'
											label={
												isAdminAdd || isVipAdd
													? 'Enter an email address'
													: 'Enter the user ID'
											}
											sx={{ width: '100%' }}
											variant='outlined'
											size='small'
											autoComplete='off'
											value={varText}
											onChange={(e) => setVarText(e.target.value)}
										/>
										<IconButton
											id='button-find-user'
											sx={{
												backgroundColor: '#1976d2',
												'&:hover': {
													backgroundColor: 'black',
												},
												marginLeft: '5px',
											}}
											onClick={findUser}
											disabled={isSearchDisabled || isFetch}
										>
											<SearchIcon sx={{ color: 'white' }} />
										</IconButton>
									</Box>
									{isFetch && (
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
												size={'30px'}
											/>
										</Container>
									)}
									{!isFetch && isError && (
										<Container
											sx={{
												width: '280px',
												display: 'flex',
												justifyContent: 'center',
												marginTop: '10px',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											<ErrorIcon color='error' sx={{ fontSize: '40px' }} />
											<Typography align='center' sx={{ fontSize: '14px' }}>
												An error occured while finding the user. Try searching
												again
											</Typography>
										</Container>
									)}
									{!isFetch && !isError && isSearch && (
										<Box>
											{user && (
												<Box
													sx={{
														width: '300px',
														marginTop: '10px',
														display: 'flex',
														alignItems: 'center',
														backgroundColor: '#E8DAEF',
														borderRadius: '10px',
														boxShadow: '0px 2px #888888',
														padding: '5px',
													}}
												>
													{user.disabled && (
														<BlockIcon sx={{ color: '#ff5722' }} />
													)}
													{!user.disabled && !user.emailVerified && (
														<HourglassFullIcon sx={{ color: '#ff5722' }} />
													)}
													{!user.disabled && user.emailVerified && (
														<CheckCircleIcon color='success' />
													)}
													<Box sx={{ marginLeft: '10px' }}>
														<Typography
															sx={{ fontSize: '14px', fontWeight: 'bold' }}
														>
															{user.username}
														</Typography>
														<Typography sx={{ fontSize: '13px' }}>
															{user.email}
														</Typography>
														{user.disabled && (
															<Typography
																sx={{ marginTop: '10px', fontSize: '13px' }}
															>
																The account is disabled and could not be added
															</Typography>
														)}
														{!user.disabled && !user.emailVerified && (
															<Typography
																sx={{ marginTop: '10px', fontSize: '13px' }}
															>
																The account is not verified yet and could not be
																added
															</Typography>
														)}
													</Box>
												</Box>
											)}
											{!user && (
												<Container
													sx={{
														width: '280px',
														display: 'flex',
														justifyContent: 'center',
														marginTop: '10px',
														flexDirection: 'column',
														alignItems: 'center',
													}}
												>
													<CancelIcon
														color='secondary'
														sx={{ fontSize: '40px' }}
													/>
													<Typography align='center' sx={{ fontSize: '14px' }}>
														The user could not be found. Check that the email
														address is correct, and if the user has registered
													</Typography>
												</Container>
											)}
										</Box>
									)}
								</>
							)}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpen(false)} color='primary'>
								No
							</Button>
							<Button
								color='primary'
								autoFocus
								disabled={isYesDisabled}
								onClick={handleDlgAction}
							>
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
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'space-between',
					}}
				>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							sx={{
								backgroundColor: '#D98880',
							}}
						>
							<HouseIcon />
						</Avatar>
						<Box sx={{ marginLeft: '10px' }}>
							<Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
								{cong.cong_name} ({cong.cong_number})
							</Typography>
							<Typography sx={{ fontWeight: 'bold', fontSize: '12px' }}>
								{`ID: ${cong.cong_id}`}
							</Typography>
						</Box>
					</Box>
					{isProcessing && (
						<CircularProgress disableShrink color='secondary' size={'30px'} />
					)}
				</Box>

				<Box
					sx={{
						borderTop: '2px solid #BFC9CA',
						marginTop: '10px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'flex-start',
						flexWrap: 'wrap',
						paddingTop: '5px',
						paddingLeft: '40px',
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={12} md={6} lg={4}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar
									sx={{
										backgroundColor: 'red',
										height: '30px',
										width: '30px',
									}}
								>
									<SecurityIcon sx={{ fontSize: '16px' }} />
								</Avatar>
								<Box sx={{ marginLeft: '10px' }}>
									<Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
										Administrators
									</Typography>
								</Box>
							</Box>
							<Box
								sx={{
									marginLeft: '40px',
									maxHeight: '130px',
									overflow: 'auto',
								}}
							>
								{admins.length === 0 && (
									<Typography sx={{ fontSize: '14px' }}>
										No users yet
									</Typography>
								)}
								{admins.length > 0 && (
									<>
										{admins.map((admin) => (
											<Box
												key={admin.email}
												sx={{
													backgroundColor: '#D6DBDF',
													borderRadius: '10px',
													padding: '10px',
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
													marginBottom: '8px',
												}}
											>
												<Box>
													<Typography sx={{ fontSize: '13px' }}>
														{admin.name}
													</Typography>
													<Typography sx={{ fontSize: '13px' }}>
														{admin.email}
													</Typography>
												</Box>
												<IconButton
													aria-label='delete'
													onClick={() => handleSetIsDeleteAdmin(admin.email)}
												>
													<DeleteIcon color='error' />
												</IconButton>
											</Box>
										))}
									</>
								)}
							</Box>
							{!isProcessing && (
								<IconButton
									onClick={handleSetAdminAdd}
									aria-label='add'
									sx={{ marginLeft: '40px' }}
								>
									<AddCircleIcon sx={{ color: 'blue' }} />
								</IconButton>
							)}
						</Grid>
						<Grid item xs={12} sm={12} md={6} lg={4}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar
									sx={{
										backgroundColor: 'green',
										height: '30px',
										width: '30px',
									}}
								>
									<GradeIcon sx={{ fontSize: '16px' }} />
								</Avatar>
								<Box sx={{ marginLeft: '10px' }}>
									<Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
										VIP users
									</Typography>
								</Box>
							</Box>
							<Box sx={{ marginLeft: '40px', maxHeight: '130px' }}>
								{vips.length === 0 && (
									<Typography sx={{ fontSize: '14px' }}>
										No users yet
									</Typography>
								)}
							</Box>
							{!isProcessing && (
								<IconButton
									onClick={handleSetVipAdd}
									aria-label='add'
									sx={{ marginLeft: '40px' }}
								>
									<AddCircleIcon sx={{ color: 'blue' }} />
								</IconButton>
							)}
						</Grid>
						<Grid item xs={12} sm={12} md={6} lg={4}>
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<Avatar
									sx={{
										height: '30px',
										width: '30px',
									}}
								>
									<PersonIcon sx={{ fontSize: '16px' }} />
								</Avatar>
								<Box sx={{ marginLeft: '10px' }}>
									<Typography sx={{ fontSize: '14px', fontWeight: 'bold' }}>
										Pocket users
									</Typography>
								</Box>
							</Box>
							<Box sx={{ marginLeft: '40px', maxHeight: '130px' }}>
								{pockets.length === 0 && (
									<Typography sx={{ fontSize: '14px' }}>
										No users yet
									</Typography>
								)}
							</Box>
							{!isProcessing && (
								<IconButton
									onClick={handleSetPocketAdd}
									aria-label='add'
									sx={{ marginLeft: '40px' }}
								>
									<AddCircleIcon sx={{ color: 'blue' }} />
								</IconButton>
							)}
						</Grid>
					</Grid>
				</Box>
				<Box
					sx={{
						borderTop: '2px solid #BFC9CA',
						display: 'flex',
						justifyContent: 'flex-end',
					}}
				>
					<Button
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
				</Box>
			</Box>
		</>
	);
};

export default CongregationItem;
