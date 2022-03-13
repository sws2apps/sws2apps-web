import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import ErrorIcon from '@mui/icons-material/Error';
import Typography from '@mui/material/Typography';
import PendingRequestItem from './PendingRequestItem';
import {
	adminEmailState,
	adminPasswordState,
	apiHostState,
	countPendingRequestsState,
	pendingRequestsState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const CongregationPendingRequests = () => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const [data, setData] = useRecoilState(pendingRequestsState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPasswordState);
	const cnRequest = useRecoilValue(countPendingRequestsState);

	const [isProcessing, setIsProcessing] = useState(true);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		const fetchPendingRequests = async () => {
			const reqPayload = {
				email: adminEmail,
				password: adminPassword,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}api/admin/pending-requests`, {
					signal: abortCont.signal,
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(reqPayload),
				})
					.then(async (res) => {
						if (res.status === 200) {
							const requests = await res.json();
							setData(requests);
						} else {
							setIsError(true);
						}
						setIsProcessing(false);
					})
					.catch((err) => {
						setIsError(true);
						setIsProcessing(false);
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
					});
			}
		};

		fetchPendingRequests();
	}, [
		adminEmail,
		adminPassword,
		apiHost,
		setAppMessage,
		setAppSeverity,
		setAppSnackOpen,
		setData,
		abortCont,
	]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

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
					<Typography>
						An error occured while fetching pending congregation requets for
						approval
					</Typography>
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
					<Typography>
						Pending request: <strong>{cnRequest}</strong>
					</Typography>
					<Box sx={{ marginTop: '20px' }}>
						{data.length > 0 && (
							<>
								{data.map((request) => (
									<PendingRequestItem key={request.id} request={request} />
								))}
							</>
						)}
					</Box>
				</>
			)}
		</>
	);
};

export default CongregationPendingRequests;
