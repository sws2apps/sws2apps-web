import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import RefreshIcon from '@mui/icons-material/Refresh';
import Typography from '@mui/material/Typography';
import BlockedItem from './BlockedItem';
import {
	apiHostState,
	blockedRequestsState,
	sessionIDState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const BlockedRequestsList = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const [data, setData] = useRecoilState(blockedRequestsState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const sessionID = useRecoilValue(sessionIDState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [isError, setIsError] = useState(false);

	const handleFetchRequests = useCallback(async () => {
		setIsError(false);
		setIsProcessing(true);

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/blocked-requests`, {
				signal: abortCont.signal,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					session_id: sessionID,
				},
			})
				.then(async (res) => {
					if (res.status === 200) {
						const response = await res.json();
						setData(response.message);
					} else {
						setIsError(true);
					}
					setIsProcessing(false);
				})
				.catch((err) => {
					if (!abortCont.signal.aborted) {
						setIsError(true);
						setIsProcessing(false);
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
					}
				});
		}
	}, [
		apiHost,
		sessionID,
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
						An error occured while fetching requests
					</Typography>
					<Link
						component='button'
						underline='none'
						variant='body2'
						onClick={handleFetchRequests}
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
							{`BLOCKED REQUESTS`}
						</Typography>
						<IconButton
							color='inherit'
							edge='start'
							onClick={handleFetchRequests}
						>
							<RefreshIcon />
						</IconButton>
					</Box>
					<Box sx={{ marginTop: '20px' }}>
						{data.length > 0 && (
							<>
								{data.map((request) => (
									<BlockedItem key={request.ip} request={request} />
								))}
							</>
						)}
					</Box>
				</>
			)}
		</>
	);
};

export default BlockedRequestsList;
