import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import KeyIcon from '@mui/icons-material/Key';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Home = () => {
	const [isLogin, setIsLogin] = useState(false);
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [errorText, setErrorText] = useState('Invalid password');

	const handlePasswordToggle = () => {
		setShowPassword(!showPassword);
	};

	const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	};

	const handleLogin = async () => {
		try {
			setIsLogin(true);
		} catch (error) {
			setErrorText(error.message);
		}
	};

	return (
		<Box
			sx={{
				backgroundColor: 'white',
				boxShadow: '5px 5px 5px 5px #F2F3F4',
				maxWidth: '320px',
				margin: '50px auto',
				padding: '20px',
				borderRadius: '10px',
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<img
					src='img/appLogo.png'
					alt='App logo'
					className={'appLogoStartup'}
				/>
				<Typography sx={{ marginTop: '10px', fontWeight: 'bold' }}>
					Administration Control Panel
				</Typography>
				<Typography sx={{ fontWeight: 'bold' }}>@sws2apps</Typography>
			</Box>

			<Box sx={{ marginTop: '25px' }}>
				<TextField
					id='admin-email'
					variant='outlined'
					autoComplete='off'
					size='small'
					required
					autoFocus
					label='Email address'
					InputProps={{
						readOnly: isLogin,
					}}
					sx={{
						width: '320px',
						marginBottom: '8px',
					}}
				/>
				<FormControl
					sx={{ marginTop: '10px', width: '320px' }}
					variant='outlined'
					size='small'
				>
					<InputLabel htmlFor='outlined-adornment-password'>
						Password
					</InputLabel>
					<OutlinedInput
						id='outlined-adornment-password'
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={handlePasswordChange}
						endAdornment={
							<InputAdornment position='end'>
								<IconButton
									aria-label='toggle password visibility'
									onClick={handlePasswordToggle}
									onMouseDown={handlePasswordToggle}
									edge='end'
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						}
						inputProps={{ readOnly: isLogin }}
						label='Password'
					/>
				</FormControl>
			</Box>

			{errorText.length > 0 && (
				<Box sx={{ margin: '10px 0' }}>
					<Typography sx={{ color: 'red', fontWeight: 'bold' }}>
						{errorText}
					</Typography>
				</Box>
			)}

			<Box
				sx={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-end' }}
			>
				<Button
					variant='contained'
					startIcon={isLogin ? null : <KeyIcon />}
					onClick={handleLogin}
					disabled={isLogin}
				>
					{isLogin && (
						<CircularProgress
							disableShrink
							color='secondary'
							size={'25px'}
							sx={{ marginRight: '10px' }}
						/>
					)}
					Login
				</Button>
			</Box>
		</Box>
	);
};

export default Home;
