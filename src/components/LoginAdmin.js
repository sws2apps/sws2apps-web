import { useRecoilState, useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import {
	adminTmpEmailState,
	adminTmpPwdState,
	hasErrorEmailState,
	hasErrorPwdState,
} from '../states/main';

const LoginAdmin = () => {
	const [userTmpPwd, setUserTmpPwd] = useRecoilState(adminTmpPwdState);
	const [userTmpEmail, setUserTmpEmail] = useRecoilState(adminTmpEmailState);

	const hasErrorEmail = useRecoilValue(hasErrorEmailState);
	const hasErrorPwd = useRecoilValue(hasErrorPwdState);

	return (
		<Box sx={{ marginTop: '25px' }}>
			<TextField
				id='outlined-email'
				label='Email address'
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpEmail}
				onChange={(e) => setUserTmpEmail(e.target.value)}
				error={hasErrorEmail ? true : false}
				sx={{ width: '100%' }}
			/>
			<TextField
				sx={{ marginTop: '15px', width: '100%' }}
				id='outlined-password'
				label='Password'
				type='password'
				variant='outlined'
				size='small'
				autoComplete='off'
				required
				value={userTmpPwd}
				onChange={(e) => setUserTmpPwd(e.target.value)}
				error={hasErrorPwd ? true : false}
			/>
		</Box>
	);
};

export default LoginAdmin;
