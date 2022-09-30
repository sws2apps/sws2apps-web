import { useCallback, useEffect, useState, useRef } from 'react';
import { useRecoilValue } from 'recoil';
import Grid from '@mui/material/Grid';
import { Congregations, Users } from '../features/dashboard';
import { getAdminDashboard } from '../api/dashboard';
import { adminEmailState, visitorIdState } from '../states/main';

const Dashboard = () => {
	const abortCont = useRef();

	const visitorId = useRecoilValue(visitorIdState);
	const adminEmail = useRecoilValue(adminEmailState);

	const [congsData, setCongsData] = useState({});
	const [usersData, setUsersData] = useState({});
	const [failedFetch, setFailedFetch] = useState(false);
	const [isProcessing, setIsProcessing] = useState(true);

	const handleGetDashboard = useCallback(async () => {
		try {
			setIsProcessing(true);
			abortCont.current = new AbortController();

			const dashboardData = await getAdminDashboard(
				adminEmail,
				visitorId,
				abortCont.current
			);

			if (dashboardData === false) {
				setFailedFetch(false);
			} else {
				setCongsData(dashboardData.congregations);
				setUsersData(dashboardData.users);
			}

			setIsProcessing(false);
		} catch (error) {
			setFailedFetch(false);
			setIsProcessing(false);
		}
	}, [adminEmail, visitorId]);

	useEffect(() => {
		handleGetDashboard();
	}, [handleGetDashboard]);

	return (
		<Grid
			container
			spacing={2}
			sx={{ marginLeft: { xs: '-11px', sm: '-16px' } }}
		>
			<Users
				isProcessing={isProcessing}
				failedFetch={failedFetch}
				usersData={usersData}
			/>
			<Congregations
				isProcessing={isProcessing}
				failedFetch={failedFetch}
				congsData={congsData}
			/>
		</Grid>
	);
};

export default Dashboard;
