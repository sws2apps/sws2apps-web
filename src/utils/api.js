import { promiseGetRecoil } from 'recoil-outside';
import { apiHostState, userEmailState, visitorIDState } from '../states/main';

const getProfile = async () => {
  const apiHost = await promiseGetRecoil(apiHostState);
  const userEmail = await promiseGetRecoil(userEmailState);
  const visitorID = await promiseGetRecoil(visitorIDState);

  return { apiHost, userEmail, visitorID };
};

export const apiFetchAnnouncements = async () => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  if (apiHost !== '') {
    const res = await fetch(`${apiHost}api/admin/announcements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        email: userEmail,
        visitorid: visitorID,
      },
    });

    return res.json();
  }
};

export const apiFetchCongregationRequests = async () => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/requests`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
        },
      });

      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationRequestDisapprove = async (id, reason) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/${id}/disapprove`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
        },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      return { status: res.status, data };
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationRequestApprove = async (id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
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
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
        },
      });
      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiCongregationDelete = async (id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
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

export const apiFetchUsers = async (id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
        },
      });
      return res.json();
    }
  } catch (err) {
    throw new Error(err);
  }
};

export const apiUserTokenRevoke = async (id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/users/${id}/revoke-token`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
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

export const apiUserAccountStatusUpdate = async (id, disabled) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/users/${id}/${disabled ? 'enable' : 'disable'}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
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

export const apiUserPwdReset = async (id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/users/${id}/reset-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
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

export const apiUserDelete = async (id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
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

export const apiCongregationRemoveUser = async (cong_id, user_id) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/${cong_id}/remove-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
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

export const apiCongregationAddUser = async (cong_id, user_uid, user_role) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/${cong_id}/add-user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
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

export const apiCongregationUserUpdateRole = async (cong_id, user_uid, user_role) => {
  const { apiHost, userEmail, visitorID } = await getProfile();

  try {
    if (apiHost !== '') {
      const res = await fetch(`${apiHost}api/admin/congregations/${cong_id}/update-role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          email: userEmail,
          visitorid: visitorID,
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
