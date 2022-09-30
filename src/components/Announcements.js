import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import AnnouncementItemCard from './AnnouncementItemCard';
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	apiHostState,
	dbAnnouncementsState,
	visitorIDState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const Announcements = () => {
	let navigate = useNavigate();
	let abortCont = useMemo(() => new AbortController(), []);

	const [dbAnnouncements, setDbAnnouncements] =
		useRecoilState(dbAnnouncementsState);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const adminEmail = useRecoilValue(adminEmailState);

	const [isProcessing, setIsProcessing] = useState(false);

	const handleNewAnnouncement = () => {
		navigate('/administration/announcements/new');
	};

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleFetchAnnouncements = useCallback(async () => {
		if (apiHost !== '') {
			setIsProcessing(true);
			fetch(`${apiHost}api/admin/announcements`, {
				signal: abortCont.signal,
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					email: adminEmail,
					visitorid: visitorID,
				},
			})
				.then(async (res) => {
					if (!abortCont.signal.aborted) {
						if (res.status === 200) {
							const announcements = await res.json();
							setDbAnnouncements(announcements);
						} else if (res.status === 403) {
							handleClearAdmin();
						}
						setIsProcessing(false);
					}
				})
				.catch((err) => {
					if (!abortCont.signal.aborted) {
						setAppMessage(err.message);
						setAppSeverity('error');
						setAppSnackOpen(true);
						setIsProcessing(false);
					}
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
		setDbAnnouncements,
		abortCont,
	]);

	useEffect(() => {
		handleFetchAnnouncements();

		return () => {
			abortCont.abort();
		};
	}, [abortCont, handleFetchAnnouncements]);

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Button
					variant='outlined'
					startIcon={<AddCircleIcon />}
					onClick={handleNewAnnouncement}
				>
					New Announcement
				</Button>
				{!isProcessing && (
					<IconButton
						color='inherit'
						edge='start'
						onClick={handleFetchAnnouncements}
						sx={{ padding: 0 }}
					>
						<RefreshIcon />
					</IconButton>
				)}
				{isProcessing && (
					<Box>
						<CircularProgress disableShrink color='secondary' size={'25px'} />
					</Box>
				)}
			</Box>
			<Box
				sx={{
					marginTop: '10px',
					display: 'flex',
					flexWrap: 'wrap',
				}}
			>
				{dbAnnouncements.length > 0 &&
					dbAnnouncements.map((announcement) => (
						<AnnouncementItemCard
							key={announcement.id}
							announcement={announcement}
							isLocked={isProcessing}
						/>
					))}
			</Box>
		</Box>
	);
};

export default Announcements;
