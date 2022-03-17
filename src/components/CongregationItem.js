import { useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import HouseIcon from '@mui/icons-material/House';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import SecurityIcon from '@mui/icons-material/Security';
import TextField from '@mui/material/TextField';
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

const CongregationItem = ({ cong }) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPasswordState);

	const [open, setOpen] = useState(false);
	const [isFetch, setIsFetch] = useState(true);
	const [isError, setIsError] = useState(false);
	const [dlgTitle, setDlgTitle] = useState('');
	const [dlgContent, setDlgContent] = useState('');
	const [isAdminAdd, setIsAdminAdd] = useState(false);
	const [isVipAdd, setIsVipAdd] = useState(false);
	const [isPocketAdd, setIsPocketAdd] = useState(false);
	const [data, setData] = useState([]);
	const [value, setValue] = useState('');

	const handleDlgClose = () => {
		setIsAdminAdd(false);
		setIsVipAdd(false);
		setIsPocketAdd(false);
		setOpen(false);
	};

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

	const fetchAllUsers = async () => {
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
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					if (res.status === 200) {
						const users = await res.json();

						let finalResult = [];
						for (let i = 0; i < users.length; i++) {
							if (
								users[i].global_role !== 'admin' &&
								users[i].cong_name === ''
							) {
								if (isAdminAdd || isVipAdd) {
									console.log(users[i]);
									if (users[i].global_role === 'vip') {
										const display_name = `[${users[i].email}] ${users[i].username}`;
										finalResult.push({
											...users[i],
											display_name: display_name,
										});
									}
								} else if (isPocketAdd) {
									if (users[i].global_role === 'pocket') {
										finalResult.push({
											...users[i],
										});
									}
								}
							}
						}

						setData(finalResult);
						console.log(finalResult);
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
									value={value}
									onChange={(e) => setValue(e.target.value)}
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
								>
									<SearchIcon sx={{ color: 'white' }} />
								</IconButton>
							</Box>
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpen(false)} color='primary'>
								No
							</Button>
							<Button color='primary' autoFocus>
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
							<Box sx={{ marginLeft: '40px', maxHeight: '130px' }}>
								{cong.admin.length === 0 && (
									<Typography sx={{ fontSize: '14px' }}>
										No users yet
									</Typography>
								)}
								{cong.admin.length > 0 && (
									<>
										{cong.admin.map((admin) => (
											<Box
												key={admin.email}
												sx={{
													backgroundColor: '#D6DBDF',
													borderRadius: '10px',
													padding: '10px',
													display: 'flex',
													justifyContent: 'space-between',
													alignItems: 'center',
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
												<IconButton aria-label='delete'>
													<DeleteIcon color='error' />
												</IconButton>
											</Box>
										))}
									</>
								)}
							</Box>
							<IconButton
								onClick={handleSetAdminAdd}
								aria-label='add'
								sx={{ marginLeft: '40px' }}
							>
								<AddCircleIcon sx={{ color: 'blue' }} />
							</IconButton>
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
								{cong.vip.length === 0 && (
									<Typography sx={{ fontSize: '14px' }}>
										No users yet
									</Typography>
								)}
							</Box>
							<IconButton aria-label='add' sx={{ marginLeft: '40px' }}>
								<AddCircleIcon sx={{ color: 'blue' }} />
							</IconButton>
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
								{cong.pocket.length === 0 && (
									<Typography sx={{ fontSize: '14px' }}>
										No users yet
									</Typography>
								)}
							</Box>
							<IconButton aria-label='add' sx={{ marginLeft: '40px' }}>
								<AddCircleIcon sx={{ color: 'blue' }} />
							</IconButton>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</>
	);
};

export default CongregationItem;
