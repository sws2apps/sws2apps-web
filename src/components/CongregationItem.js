import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import GradeIcon from '@mui/icons-material/Grade';
import HouseIcon from '@mui/icons-material/House';
import IconButton from '@mui/material/IconButton';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonIcon from '@mui/icons-material/Person';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import Typography from '@mui/material/Typography';
import CongregationUserRole from './CongregationUserRole';
import { handleAdminLogout } from '../utils/admin';
import {
	adminEmailState,
	apiHostState,
	congsListState,
	visitorIDState,
} from '../states/main';
import {
	appMessageState,
	appSeverityState,
	appSnackOpenState,
} from '../states/notification';

const CongregationItem = ({
	congItem,
	isCongProcessing,
	congID,
	setCongID,
	setIsCongProcessing,
}) => {
	let abortCont = useMemo(() => new AbortController(), []);

	const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
	const setAppSeverity = useSetRecoilState(appSeverityState);
	const setAppMessage = useSetRecoilState(appMessageState);
	const setCongsList = useSetRecoilState(congsListState);

	const apiHost = useRecoilValue(apiHostState);
	const visitorID = useRecoilValue(visitorIDState);
	const adminEmail = useRecoilValue(adminEmailState);

	const [cong, setCong] = useState(congItem);
	const [open, setOpen] = useState(false);
	const [dlgTitle, setDlgTitle] = useState('');
	const [isYesDisabled, setIsYesDisabled] = useState(true);
	const [isProcessing, setIsProcessing] = useState(false);
	const [isDelete, setIsDelete] = useState(false);
	const [toBeDelName, setToBeDelName] = useState('');
	const [toBeDelID, setToBeDelID] = useState('');

	const handleClearAdmin = useCallback(async () => {
		await handleAdminLogout();
	}, []);

	const handleDlgClose = () => {
		setIsDelete(false);
		setOpen(false);
	};

	const handleSetIsDeleteMember = (username, user_id) => {
		setToBeDelName(username);
		setToBeDelID(user_id);
		setDlgTitle(`Remove member from congregation?`);
		setIsDelete(true);
		setIsYesDisabled(false);
		setOpen(true);
	};

	const handleDlgAction = async () => {
		setOpen(false);
		if (isDelete) {
			await handleDeleteUser(toBeDelID);
			setIsDelete(false);
		}
	};

	const handleDeleteUser = async (userID) => {
		try {
			setCongID(cong.cong_id);
			setIsCongProcessing(true);

			const reqPayload = {
				user_uid: userID,
			};

			if (apiHost !== '') {
				const response = await fetch(
					`${apiHost}api/admin/congregations/${congID}/remove-user`,
					{
						signal: abortCont.signal,
						method: 'PATCH',
						headers: {
							'Content-Type': 'application/json',
							email: adminEmail,
							visitor_id: visitorID,
						},
						body: JSON.stringify(reqPayload),
					}
				);

				if (response.status === 200) {
					const data = await response.json();
					setCongsList(data);
					setIsCongProcessing(false);
				} else if (response.status === 403) {
					handleClearAdmin();
				} else {
					const data = await response.json();
					setIsCongProcessing(false);
					setAppMessage(data.message);
					setAppSeverity('warning');
					setAppSnackOpen(true);
				}
			}
		} catch (err) {
			setIsCongProcessing(false);
			setAppMessage(err.message);
			setAppSeverity('error');
			setAppSnackOpen(true);
		}
	};

	useEffect(() => {
		if (isCongProcessing) {
			if (congItem.cong_id === congID) {
				setIsProcessing(true);
			} else {
				setIsProcessing(false);
			}
		} else {
			setIsProcessing(false);
		}
	}, [congItem, isCongProcessing, congID]);

	useEffect(() => {
		setCong(congItem);
	}, [congItem]);

	useEffect(() => {
		return () => abortCont.abort();
	}, [abortCont]);

	return (
		<>
			<Box>
				{open && (
					<Dialog open={open} onClose={handleDlgClose}>
						<DialogTitle>
							<Typography
								sx={{ fontWeight: 'bold', fontSize: '18px', lineHeight: 1.2 }}
							>
								{dlgTitle}
							</Typography>
						</DialogTitle>
						<DialogContent sx={{ paddingTop: '15px !important' }}>
							{isDelete && (
								<Typography>{`Are you sure to remove ${toBeDelName} from this congregation?`}</Typography>
							)}
						</DialogContent>
						<DialogActions>
							<Button onClick={() => setOpen(false)} color='primary'>
								No
							</Button>
							<Button
								color='primary'
								autoFocus
								disabled={isYesDisabled}
								onClick={handleDlgAction}
							>
								Yes
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</Box>

			{Object.keys(cong).length > 0 && (
				<Box>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Box sx={{ display: 'flex', alignItems: 'center' }}>
							<Avatar
								sx={{
									backgroundColor: '#D98880',
								}}
							>
								<HouseIcon />
							</Avatar>
							<Box sx={{ marginLeft: '10px' }}>
								<Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
									{cong.cong_name} ({cong.cong_number})
								</Typography>
							</Box>
						</Box>
						{isProcessing && (
							<CircularProgress disableShrink color='secondary' size={'30px'} />
						)}
					</Box>

					<Box
						sx={{
							borderTop: '2px solid #BFC9CA',
							marginTop: '10px',
							paddingTop: '5px',
							paddingLeft: '50px',
						}}
					>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '10px',
							}}
						>
							<PeopleAltIcon sx={{ color: '#4A235A' }} />
							<Typography sx={{ fontWeight: 'bold', marginLeft: '10px' }}>
								Members
							</Typography>
						</Box>

						{cong.cong_members.map((member, index) => (
							<Box
								key={`member-${index}`}
								sx={{
									backgroundColor: '#F4ECF7',
									padding: '10px',
									marginBottom: '10px',
									borderRadius: '10px',
								}}
							>
								<Box
									sx={{
										borderBottom: '2px solid #BFC9CA',
										paddingBottom: '5px',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<Box sx={{ display: 'flex', alignItems: 'center' }}>
										<Avatar
											sx={{
												backgroundColor: `${
													member.global_role === 'vip' ? 'green' : '#5B2C6F'
												}`,
											}}
										>
											{member.global_role === 'vip' ? (
												<GradeIcon />
											) : (
												<PersonIcon />
											)}
										</Avatar>

										<Box sx={{ marginLeft: '10px' }}>
											<Typography
												sx={{
													fontSize: '14px',
													fontWeight: 'bold',
												}}
											>
												{member.name}
											</Typography>
											<Typography sx={{ fontSize: '12px' }}>
												{member.user_uid}
											</Typography>
										</Box>
									</Box>
									{!isProcessing && (
										<Box
											sx={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
											}}
										>
											<IconButton
												aria-label='delete'
												onClick={() =>
													handleSetIsDeleteMember(member.name, member.user_uid)
												}
											>
												<PersonRemoveIcon color='error' />
											</IconButton>
										</Box>
									)}
								</Box>
								<CongregationUserRole member={member} cong_id={congID} />
							</Box>
						))}
					</Box>
				</Box>
			)}
		</>
	);
};

export default CongregationItem;
