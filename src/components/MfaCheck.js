import { useRecoilState, useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { adminTokenState, hasErrorTokenState } from '../states/main';

const MfaCheck = () => {
	const [adminToken, setAdminToken] = useRecoilState(adminTokenState);

	const hasErrorToken = useRecoilValue(hasErrorTokenState);

	return (
		<Box sx={{ marginTop: '25px', width: '100%' }}>
			<TextField
				id='outlined-token'
				type='number'
				label='Two-factor authentication code'
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={adminToken}
				onChange={(e) => setAdminToken(e.target.value)}
				error={hasErrorToken ? true : false}
				sx={{ width: '100%' }}
			/>
		</Box>
	);
};

export default MfaCheck;
