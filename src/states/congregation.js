import { atom, selector } from 'recoil';

export const congregationRequestsState = atom({
  key: 'congregationRequests',
  default: [],
});

export const countCongregationRequestsState = selector({
  key: 'countCongregationRequests',
  get: ({ get }) => {
    const requests = get(congregationRequestsState);

    return requests.length;
  },
});
