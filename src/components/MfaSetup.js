import { useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import QRCode from 'qrcode';
import Box from '@mui/material/Box';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import MfaCheck from './MfaCheck';
import {
	isAdminState,
	qrCodePathState,
	secretTokenPathState,
} from '../states/main';

const MfaSetup = () => {
	const setIsAdmin = useSetRecoilState(isAdminState);

	const qrCodePath = useRecoilValue(qrCodePathState);
	const token = useRecoilValue(secretTokenPathState);

	const [imgPath, setImgPath] = useState('');
	const [isNoQR, setIsNoQR] = useState(false);

	const handleCopyClipboard = async (text) => {
		await navigator.clipboard.writeText(text);
	};

	useEffect(() => {
		const getQrCode = async () => {
			QRCode.toDataURL(qrCodePath, function (err, data_url) {
				if (err) {
					setIsAdmin(false);
					return;
				}

				setImgPath(data_url);
			});
		};

		getQrCode();
	}, [qrCodePath, setIsAdmin]);

	return (
		<Box sx={{ marginTop: '15px' }}>
			<Box
				sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
			>
				{isNoQR && (
					<>
						<Typography
							align='center'
							sx={{ fontSize: '14px', marginBottom: '10px' }}
						>
							Two-factor authentication is required. Copy the code below and add
							it manually to the authenticator app on your phone, like{' '}
							<em>Microsoft Authenticator</em> or <em>Google Authenticator.</em>
						</Typography>
						<Box
							sx={{
								width: '100%',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'flex-end',
								marginBottom: '10px',
							}}
						>
							<TextField
								id='outlined-token'
								label='Token'
								variant='outlined'
								size='small'
								autoComplete='off'
								value={token}
								multiline
								sx={{ width: '100%', marginTop: '10px' }}
								InputProps={{
									readOnly: true,
								}}
							/>
							<IconButton
								aria-label='delete'
								onClick={() => handleCopyClipboard(token)}
							>
								<ContentCopyIcon />
							</IconButton>
						</Box>
					</>
				)}
				{!isNoQR && (
					<>
						<Typography
							align='center'
							sx={{ fontSize: '14px', marginBottom: '10px' }}
						>
							Two-factor authentication is required. Scan the QR code below,
							using an authenticator app on your phone, like{' '}
							<em>Microsoft Authenticator</em> or <em>Google Authenticator.</em>
						</Typography>
						{imgPath.length > 0 && <img src={imgPath} alt='QR Code 2FA' />}
					</>
				)}
			</Box>
			<Box>
				<Link
					component='button'
					underline='none'
					variant='body2'
					onClick={() => setIsNoQR(!isNoQR)}
				>
					{isNoQR ? 'Scan QR Code instead' : 'I cannot scan this QR Code'}
				</Link>
			</Box>
			<Box sx={{ marginBottom: '15px' }}>
				<Typography sx={{ fontSize: '14px', marginTop: '10px' }}>
					Then, enter below the OTP code generated from the app
				</Typography>
			</Box>
			<MfaCheck />
		</Box>
	);
};

export default MfaSetup;
