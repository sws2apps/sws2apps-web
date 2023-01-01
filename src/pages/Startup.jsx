import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import { EmailBlocked, EmailNotVerified, SetupMFA, Signin, UnauthorizedRole, VerifyMFA } from '../features/startup';
import {
  isEmailBlockedState,
  isEmailNotVerifiedState,
  isUnauthorizedRoleState,
  isUserMfaSetupState,
  isUserMfaVerifyState,
  isUserSignInState,
} from '../states/main';

const Startup = () => {
  const isUserSignIn = useRecoilValue(isUserSignInState);
  const isEmailNotVerified = useRecoilValue(isEmailNotVerifiedState);
  const isUserMfaSetup = useRecoilValue(isUserMfaSetupState);
  const isUnauthorizedRole = useRecoilValue(isUnauthorizedRoleState);
  const isUserMfaVerify = useRecoilValue(isUserMfaVerifyState);
  const isEmailBlocked = useRecoilValue(isEmailBlockedState);

  return (
    <Box>
      {isUserSignIn && <Signin />}
      {isEmailNotVerified && <EmailNotVerified />}
      {isUserMfaSetup && <SetupMFA />}
      {isUnauthorizedRole && <UnauthorizedRole />}
      {isUserMfaVerify && <VerifyMFA />}
      {isEmailBlocked && <EmailBlocked />}
    </Box>
  );
};

export default Startup;
