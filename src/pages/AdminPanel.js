import { Route, Routes } from 'react-router-dom';
import Box from '@mui/material/Box';
import AdminMenu from '../components/AdminMenu';
import CongregationsList from '../components/CongregationsList';
import UsersList from '../components/UsersList';

const AdminPanel = () => {
	return (
		<Box sx={{ display: 'flex' }}>
			<AdminMenu />

			<Box sx={{ width: '100%' }}>
				<Routes>
					<Route path='/congregation' element={<CongregationsList />} />
					<Route path='/users' element={<UsersList />} />
				</Routes>
			</Box>
		</Box>
	);
};

export default AdminPanel;
