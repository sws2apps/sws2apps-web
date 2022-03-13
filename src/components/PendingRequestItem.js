import { useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import BlockIcon from '@mui/icons-material/Block';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import {
	adminEmailState,
	adminPasswordState,
	apiHostState,
	pendingRequestsState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const PendingRequestItem = ({ request }) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const [pendingReq, setPendingReq] = useRecoilState(pendingRequestsState);

	const apiHost = useRecoilValue(apiHostState);
	const adminEmail = useRecoilValue(adminEmailState);
	const adminPassword = useRecoilValue(adminPasswordState);

	const [isProcessing, setIsProcessing] = useState(false);
	const [isDisapprove, setIsDisapprove] = useState(false);
	const [disapproveReason, setDisapproveReason] = useState(false);

	const handleCongDisapprove = async () => {
		if (isDisapprove) {
			setIsDisapprove(false);
			setIsProcessing(true);
			const reqPayload = {
				email: adminEmail,
				password: adminPassword,
				cong_name: request.cong_name,
				cong_number: request.cong_number,
				request_email: request.email,
				request_id: request.id,
				request_username: request.username,
				disapproval_reason: disapproveReason,
			};

			if (apiHost !== '') {
				fetch(`${apiHost}api/admin/congregation-request-disapprove`, {
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
							let newReq = pendingReq.filter(
								(pending) => pending.id !== request.id
							);
							setIsProcessing(false);
							setPendingReq(newReq);
							setAppMessage('Congregation account request disapproved');
							setAppSeverity('info');
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
		} else {
			setDisapproveReason('');
			setIsDisapprove(true);
		}
	};

	const handleCongApprove = async () => {
		setIsProcessing(true);
		const reqPayload = {
			email: adminEmail,
			password: adminPassword,
			cong_name: request.cong_name,
			cong_number: request.cong_number,
			request_email: request.email,
			request_id: request.id,
			request_username: request.username,
		};

		if (apiHost !== '') {
			fetch(`${apiHost}api/admin/create-congregation`, {
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
						let newReq = pendingReq.filter(
							(pending) => pending.id !== request.id
						);
						setIsProcessing(false);
						setPendingReq(newReq);
						setAppMessage('Congregation account approved and created');
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
		<Box
			sx={{
				width: '100%',
				backgroundColor: '#AED6F1',
				borderRadius: '10px',
				padding: '10px',
				marginBottom: '15px',
			}}
		>
			{request && (
				<Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
						<Box>
							<Typography
								sx={{ fontWeight: 'bold', textDecoration: 'underline' }}
							>
								Requestor
							</Typography>
							<Typography>
								{request.username} ({request.email})
							</Typography>
							<Typography
								sx={{
									marginTop: '15px',
									fontWeight: 'bold',
									textDecoration: 'underline',
								}}
							>
								Congregation name
							</Typography>
							<Typography>{request.cong_name}</Typography>
							<Typography
								sx={{
									marginTop: '15px',
									fontWeight: 'bold',
									textDecoration: 'underline',
								}}
							>
								Congregation number
							</Typography>
							<Typography>{request.cong_number}</Typography>
						</Box>
						<Typography sx={{ fontWeight: 'bold' }}>{request.id}</Typography>
					</Box>
					{isDisapprove && (
						<Box
							sx={{
								marginTop: '15px',
								backgroundColor: 'white',
								padding: '10px',
							}}
						>
							<TextField
								id='outlined-disapprove'
								label='Disapproval reason'
								variant='outlined'
								size='small'
								autoComplete='off'
								required
								value={disapproveReason}
								onChange={(e) => setDisapproveReason(e.target.value)}
								sx={{ width: '100%' }}
							/>
						</Box>
					)}

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
						}}
					>
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
									size={'40px'}
								/>
							</Container>
						)}
						{!isProcessing && (
							<>
								<Button
									onClick={handleCongApprove}
									startIcon={<CheckCircleOutline />}
									sx={{ color: 'green', marginRight: '5px' }}
								>
									Approve
								</Button>
								<Button
									onClick={handleCongDisapprove}
									startIcon={<BlockIcon />}
									sx={{ color: 'red', marginRight: '5px' }}
								>
									Disapprove
								</Button>
							</>
						)}
					</Box>
				</Box>
			)}
		</Box>
	);
};

export default PendingRequestItem;
