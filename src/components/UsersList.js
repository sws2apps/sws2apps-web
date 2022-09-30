import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';
import UserItem from './UserItem';
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	apiHostState,
	visitorIDState,
	usersListSortedState,
	usersListState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const UsersList = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setData = useSetRecoilState(usersListState);

	const apiHost = useRecoilValue(apiHostState);
	const usersList = useRecoilValue(usersListSortedState);
	const visitorID = useRecoilValue(visitorIDState);
	const adminEmail = useRecoilValue(adminEmailState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [isError, setIsError] = useState(false);

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleFetchUsers = useCallback(async () => {
		setIsError(false);
		setIsProcessing(true);

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/users`, {
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
						const users = await res.json();
						setData(users);
						setIsProcessing(false);
					} else if (res.status === 403) {
						handleClearAdmin();
					} else {
						setIsError(true);
						setIsProcessing(false);
					}
				})
				.catch((err) => {
					setIsError(true);
					setIsProcessing(false);
					setAppMessage(err.message);
					setAppSeverity('error');
					setAppSnackOpen(true);
				});
		}
	}, [
		adminEmail,
		apiHost,
		visitorID,
		handleClearAdmin,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setData,
		abortCont,
	]);

	useEffect(() => {
		return () => {
			setData([]);
			abortCont.abort();
		};
	}, [abortCont, setData]);

	return (
		<>
			{isError && (
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
						An error occured while fetching users
					</Typography>
					<Link
						component='button'
						underline='none'
						variant='body2'
						onClick={handleFetchUsers}
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
			{!isProcessing && !isError && (
				<>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
						}}
					>
						<Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
							{`USERS LIST (${usersList.length})`}
						</Typography>
						<IconButton color='inherit' edge='start' onClick={handleFetchUsers}>
							<RefreshIcon />
						</IconButton>
					</Box>
					<Box sx={{ marginTop: '20px' }}>
						{usersList.length > 0 && (
							<>
								{usersList.map((user) => (
									<UserItem key={user.id} user={user} />
								))}
							</>
						)}
					</Box>
				</>
			)}
		</>
	);
};

export default UsersList;
