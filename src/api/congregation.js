import { getAuth } from 'firebase/auth';
import { getProfile } from './common';

export const apiFetchCountries = async () => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchCongregations = async (id) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/congregations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
        },
      });
      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchCongregationsByCountry = async (country, name) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (name && apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/list-by-country`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
          country,
          name,
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }

    return [];
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationAddUser = async (cong_country, cong_name, cong_number, user_uid, user_role) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/congregations/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
        },
        body: JSON.stringify({ cong_country, cong_name, cong_number, user_uid, user_role }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationRemoveUser = async (cong_id, user_id) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/congregations/${cong_id}/remove-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ user_id }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationUserUpdateRole = async (cong_id, user_uid, user_role) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/congregations/${cong_id}/update-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
        body: JSON.stringify({ user_uid, user_role }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationDelete = async (id) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/congregations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          visitorid: visitorID,
          uid: user.uid,
        },
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiFetchPublicTalks = async () => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/public-talks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
        },
      });
      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiUpdatePublicTalk = async (language, talkNumber, talkTitle, talkModified) => {
  const { apiHost, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/admin/public-talks`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          appclient: 'admin',
          appversion: import.meta.env.PACKAGE_VERSION,
          uid: user.uid,
          visitorid: visitorID,
        },
        body: JSON.stringify({ language, talkTitle, talkModified, talkNumber }),
      });

      return { status: res.status, data: res.json() };
    }
  } catch (err) {
    throw new Error(err);
  }
};
