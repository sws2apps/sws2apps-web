import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import AddCircleIcon from '@mui/icons-material/AddCircle';
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
import FeedbackIcon from '@mui/icons-material/Feedback';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CongregationItem from '../components/CongregationItem';
import {
	adminEmailState,
	apiHostState,
	congsListSortedState,
	congsListState,
	visitorIDState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';
import { handleAdminLogout } from '../utils/admin';

const CongregationsList = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setData = useSetRecoilState(congsListState);

	const apiHost = useRecoilValue(apiHostState);
	const congsList = useRecoilValue(congsListSortedState);
	const visitorID = useRecoilValue(visitorIDState);
	const adminEmail = useRecoilValue(adminEmailState);

	const [open, setOpen] = useState(false);
	const [isFetch, setIsFetch] = useState(false);
	const [dlgTitle, setDlgTitle] = useState('');
	const [isMemberAdd, setIsMemberAdd] = useState(false);
	const [isCongDelete, setIsCongDelete] = useState(false);
	const [varText, setVarText] = useState('');
	const [user, setUser] = useState(undefined);
	const [isSearch, setIsSearch] = useState(false);
	const [isYesDisabled, setIsYesDisabled] = useState(true);
	const [isSearchDisabled, setIsSearchDisable] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isCongProcessing, setIsCongProcessing] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isErrorFetch, setIsErrorFetch] = useState(false);
	const [isUserExist, setIsUserExist] = useState(false);
	const [congID, setCongID] = useState('');
	const [congName, setCongName] = useState('');

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleFetchCongregations = useCallback(async () => {
		setIsErrorFetch(false);
		setIsProcessing(true);

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/congregations`, {
				signal: abortCont.signal,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					email: adminEmail,
					visitorid: visitorID,
				},
			})
				.then(async (res) => {
					if (res.status === 200) {
						const congregations = await res.json();
						setData(congregations);
					} else {
						setIsErrorFetch(true);
					}
					setIsProcessing(false);
				})
				.catch((err) => {
					if (!abortCont.signal.aborted) {
						setIsErrorFetch(true);
						setIsProcessing(false);
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
					}
				});
		}
	}, [
		adminEmail,
		apiHost,
		visitorID,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setData,
		abortCont,
	]);

	const handleDlgClose = () => {
		setIsMemberAdd(false);
		setIsCongDelete(false);
		setCongID('');
		setOpen(false);
	};

	const handleSetIsAddMember = (cong_id) => {
		setDlgTitle('Add member to congregation');
		setCongID(cong_id);
		setIsFetch(false);
		setIsError(false);
		setIsSearch(false);
		setIsUserExist(false);
		setUser(undefined);
		setVarText('');
		setIsMemberAdd(true);
		setIsYesDisabled(true);
		setOpen(true);
	};

	const handleSetIsCongDelete = (cong_id, cong_name) => {
		setDlgTitle('Delete congregation');
		setCongID(cong_id);
		setCongName(cong_name);
		setIsCongDelete(true);
		setIsYesDisabled(false);
		setOpen(true);
	};

	const handleDlgAction = async () => {
		setOpen(false);
		if (isMemberAdd) {
			await handleAddMember();
			setIsMemberAdd(false);
		} else if (isCongDelete) {
			await handleDeleteCong();
			setIsCongDelete(false);
		}
	};

	const handleAddMember = async () => {
		try {
			setIsCongProcessing(true);

			const reqPayload = {
				user_uid: user.user_uid,
			};

			if (apiHost !== '') {
				const response = await fetch(
					`${apiHost}api/admin/congregations/${congID}/add-user`,
					{
						signal: abortCont.signal,
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							email: adminEmail,
							visitorid: visitorID,
						},
						body: JSON.stringify(reqPayload),
					}
				);

				if (response.status === 200) {
					const data = await response.json();
					setData(data);
					setIsCongProcessing(false);
				} else if (response.status === 403) {
					handleClearAdmin();
				} else {
					const data = await response.json();
					setIsCongProcessing(false);
					setAppMessage(data.message);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
			}
		} catch (err) {
			setIsCongProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	const findUser = async () => {
		try {
			setUser(undefined);
			setIsUserExist(false);
			setIsSearch(true);
			setIsError(false);
			setIsFetch(true);
			setIsYesDisabled(true);

			if (apiHost !== '') {
				const response = await fetch(
					`${apiHost}api/admin/users/find?search=${varText}`,
					{
						signal: abortCont.signal,
						method: 'GET',
						headers: {
							'Content-Type': 'application/json',
							email: adminEmail,
							visitorid: visitorID,
						},
					}
				);

				if (response.status === 200) {
					const findUser = await response.json();
					if (findUser.cong_id === congID) {
						setUser(findUser);
						setIsUserExist(true);
					} else if (findUser.cong_id.length === 0) {
						if (findUser.global_role === 'vip') {
							if (
								findUser.emailVerified &&
								findUser.mfaEnabled &&
								!findUser.disabled
							) {
								setUser(findUser);
								setIsYesDisabled(false);
							}
						} else if (findUser.global_role === 'pocket') {
							if (findUser.mfaEnabled && !findUser.disabled) {
								setUser(findUser);
								setIsYesDisabled(false);
							}
						}
					}

					setIsFetch(false);
				} else if (response.status === 403) {
					handleClearAdmin();
				} else if (response.status === 404) {
					setUser(undefined);
					setIsFetch(false);
				} else {
					setIsError(true);
					setIsFetch(false);
				}
			}
		} catch (err) {
			setIsError(true);
			setIsFetch(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	const handleDeleteCong = async () => {
		try {
			setIsCongProcessing(true);

			if (apiHost !== '') {
				const response = await fetch(
					`${apiHost}api/admin/congregations/${congID}`,
					{
						signal: abortCont.signal,
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							email: adminEmail,
							visitorid: visitorID,
						},
					}
				);

				if (response.status === 200) {
					const data = await response.json();
					setData(data);
					setIsCongProcessing(false);
				} else if (response.status === 403) {
					handleClearAdmin();
				} else {
					const data = await response.json();
					setIsCongProcessing(false);
					setAppMessage(data.message);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
			}
		} catch (err) {
			setIsCongProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
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
		return () => {
			setData([]);
			abortCont.abort();
		};
	}, [abortCont, setData]);

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
							{isMemberAdd && (
								<>
									<Box sx={{ display: 'flex' }}>
										<TextField
											id='outlined-identifier'
											label='Enter an email address or Pocket ID'
											sx={{ width: '300px' }}
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
													{isUserExist && (
														<FeedbackIcon sx={{ color: '#3498DB' }} />
													)}
													{!isUserExist && (
														<>
															{user.disabled && (
																<BlockIcon sx={{ color: '#ff5722' }} />
															)}
															{!user.disabled && !user.emailVerified && (
																<HourglassFullIcon sx={{ color: '#ff5722' }} />
															)}
															{!user.disabled && user.emailVerified && (
																<CheckCircleIcon color='success' />
															)}
														</>
													)}

													<Box sx={{ marginLeft: '10px' }}>
														<Typography
															sx={{ fontSize: '14px', fontWeight: 'bold' }}
														>
															{user.username}
														</Typography>
														<Typography sx={{ fontSize: '13px' }}>
															{user.user_uid}
														</Typography>
														<Typography
															sx={{ marginTop: '10px', fontSize: '13px' }}
														>
															{isUserExist &&
																'This user is already member of the congregation'}
															{!isUserExist && (
																<>
																	{user.disabled &&
																		'The account is disabled and could not be added'}
																	{!user.disabled &&
																		!user.emailVerified &&
																		'The account is not verified yet and could not be added'}
																</>
															)}
														</Typography>
													</Box>
												</Box>
											)}
											{!user && (
												<Container
													sx={{
														width: '320px',
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
														The user could not be found. Check that the user
														identifier is correct and it is not yet member of
														any congregations. Also, check if the user has
														registered. MFA enabled is required, and disabled
														account will not show.
													</Typography>
												</Container>
											)}
										</Box>
									)}
								</>
							)}
							{isCongDelete && (
								<Typography>{`Are you sure to delete the ${congName} congregation?`}</Typography>
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

			{isErrorFetch && (
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '25px',
						flexDirection: 'column',
						alignItems: 'center',
					}}
				>
					<ErrorIcon
						color='error'
						sx={{
							fontSize: '60px',
							cursor: 'pointer',
						}}
					/>
					<Typography align='center' sx={{ marginTop: '15px' }}>
						An error occured while fetching congregations
					</Typography>
					<Link
						component='button'
						underline='none'
						variant='body2'
						onClick={handleFetchCongregations}
					>
						Refresh
					</Link>
				</Container>
			)}
			{isProcessing && (
				<Container
					sx={{
						display: 'flex',
						justifyContent: 'center',
						marginTop: '25px',
					}}
				>
					<CircularProgress disableShrink color='secondary' size={'60px'} />
				</Container>
			)}
			{!isProcessing && !isErrorFetch && (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
							{`CONGREGATION LIST (${congsList.length})`}
						</Typography>
						<IconButton
							color='inherit'
							edge='start'
							onClick={handleFetchCongregations}
						>
							<RefreshIcon />
						</IconButton>
					</Box>
					<Box sx={{ marginTop: '20px' }}>
						{congsList.length > 0 && (
							<>
								{congsList.map((cong) => (
									<Box
										key={cong.cong_id}
										sx={{
											width: '100%',
											backgroundColor: '#AED6F1',
											borderRadius: '10px',
											padding: '10px',
											marginBottom: '15px',
										}}
									>
										<CongregationItem
											congItem={cong}
											isCongProcessing={isCongProcessing}
											congID={congID}
											setIsCongProcessing={(value) =>
												setIsCongProcessing(value)
											}
											setCongID={(value) => setCongID(value)}
										/>
										<Box
											sx={{
												borderTop: '2px solid #BFC9CA',
												display: 'flex',
												justifyContent: 'flex-end',
											}}
										>
											<Button
												startIcon={<AddCircleIcon sx={{ color: 'green' }} />}
												sx={{
													color: 'black',
													marginLeft: '5px',
													marginTop: '5px',
												}}
												variant='outlined'
												onClick={() => handleSetIsAddMember(cong.cong_id)}
												disabled={isCongProcessing}
											>
												Add member
											</Button>
											<Button
												startIcon={<DeleteIcon sx={{ color: 'red' }} />}
												sx={{
													color: 'black',
													marginLeft: '5px',
													marginTop: '5px',
												}}
												variant='outlined'
												onClick={() =>
													handleSetIsCongDelete(cong.cong_id, cong.cong_name)
												}
												disabled={isCongProcessing}
											>
												Delete
											</Button>
										</Box>
									</Box>
								))}
							</>
						)}
					</Box>
				</>
			)}
		</>
	);
};

export default CongregationsList;
