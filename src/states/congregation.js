import { atom } from 'recoil';

export const publicTalksListState = atom({
  key: 'publicTalksList',
  default: [],
});

export const publicTalkImportOpenState = atom({
  key: 'publicTalkImportOpen',
  default: false,
});
