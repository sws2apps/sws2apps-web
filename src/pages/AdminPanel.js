import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdminMenu from '../components/AdminMenu';
import AnnouncementItemDetails from '../components/AnnouncementItemDetails';
import Announcements from '../components/Announcements';
import BlockedRequestsList from '../components/BlockedRequestsList';
import CongregationsList from '../components/CongregationsList';
import CongregationPendingRequests from '../components/CongregationPendingRequests';
import UsersList from '../components/UsersList';

const AdminPanel = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<AdminMenu />

			<Box sx={{ width: '100%' }}>
				<Routes>
					<Route path='/announcements' element={<Announcements />} />
					<Route
						path='/announcements/new'
						element={<AnnouncementItemDetails />}
					/>
					<Route
						path='/announcements/:id'
						element={<AnnouncementItemDetails />}
					/>
					<Route
						path='/congregation-requests'
						element={<CongregationPendingRequests />}
					/>
					<Route path='/congregation' element={<CongregationsList />} />
					<Route path='/users' element={<UsersList />} />
					<Route path='/blocked-requests' element={<BlockedRequestsList />} />
				</Routes>
			</Box>
		</Box>
	);
};

export default AdminPanel;
