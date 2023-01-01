import { useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  apiHostState,
  isAdminState,
  isOnlineState,
  rootModalOpenState,
  userEmailState,
  visitorIDState,
} from '../../states/main';

const UserAutoLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let abortCont = useMemo(() => new AbortController(), []);

  const [userEmail, setUserEmail] = useRecoilState(userEmailState);
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);

  const setModalOpen = useSetRecoilState(rootModalOpenState);

  const isOnline = useRecoilValue(isOnlineState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);

  const handleDisapproved = useCallback(async () => {
    setModalOpen(true);
    localStorage.removeItem('email');
    window.location.href = './';
  }, [setModalOpen]);

  const checkLogin = useCallback(async () => {
    try {
      if (apiHost !== '' && userEmail !== '' && visitorID !== '') {
        const res = await fetch(`${apiHost}api/admin/`, {
          signal: abortCont.signal,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        if (res.status === 200) {
          setIsAdmin(true);
        }

        if (res.status === 404) {
          await handleDisapproved();
        }
      }
    } catch {}
  }, [apiHost, abortCont, handleDisapproved, visitorID, userEmail, setIsAdmin]);

  useEffect(() => {
    setUserEmail(localStorage.getItem('email'));
  }, [setUserEmail]);

  useEffect(() => {
    if (isOnline) {
      checkLogin();
    }
  }, [checkLogin, isOnline, userEmail]);

  useEffect(() => {
    if (isAdmin) {
      if (location.pathname === '/signin') {
        navigate('/');
      }
    }
  }, [isAdmin, location.pathname, navigate]);

  return <></>;
};

export default UserAutoLogin;
