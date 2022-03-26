import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import Typography from '@mui/material/Typography';
import WebIcon from '@mui/icons-material/Web';
import {
	apiHostState,
	blockedRequestsState,
	visitorIDState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const BlockedItem = ({ request }) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setData = useSetRecoilState(blockedRequestsState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);

	const [isProcessing, setIsProcessing] = useState(false);

	const retryTime = () => {
		const date = new Date(request.retryOn); // create Date object

		return date.toUTCString();
	};

	const handleUnblockRequests = useCallback(async () => {
		setIsProcessing(true);

		const reqPayload = {
			request_ip: request.ip,
		};
		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/unblock-request`, {
				signal: abortCont.signal,
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					visitor_id: visitorID,
				},
				body: JSON.stringify(reqPayload),
			})
				.then(async (res) => {
					const response = await res.json();
					if (res.status === 200) {
						setData(response.message);
					} else {
						setAppMessage(response.message);
						setAppSeverity('warning');
						setAppSnackOpen(true);
					}
					setIsProcessing(false);
				})
				.catch((err) => {
					if (!abortCont.signal.aborted) {
						setIsProcessing(false);
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
					}
				});
		}
	}, [
		apiHost,
		visitorID,
		request,
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
		<Box
			sx={{
				width: '100%',
				backgroundColor: '#AED6F1',
				borderRadius: '10px',
				padding: '10px',
				marginBottom: '15px',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<WebIcon sx={{ color: '#5B2C6F', fontSize: '50px' }} />
				<Box sx={{ marginLeft: '10px', width: '200px' }}>
					<Typography sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
						{request.ip}
					</Typography>
					<Typography>{request.city}</Typography>
				</Box>
				<Box sx={{ width: '280px' }}>
					<Typography sx={{ fontWeight: 'bold', textDecoration: 'underline' }}>
						Auto unblock on
					</Typography>
					<Typography>{retryTime()}</Typography>
				</Box>
			</Box>
			{isProcessing && (
				<CircularProgress disableShrink color='secondary' size={'30px'} />
			)}
			{!isProcessing && (
				<Button
					onClick={handleUnblockRequests}
					startIcon={<LockOpenIcon sx={{ color: 'red' }} />}
					sx={{
						color: 'black',
						marginLeft: '5px',
						marginTop: '5px',
					}}
					variant='outlined'
				>
					Unblock
				</Button>
			)}
		</Box>
	);
};

export default BlockedItem;
