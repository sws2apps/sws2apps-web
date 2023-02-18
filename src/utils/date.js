import dateFormat from 'dateformat';

export const getLongDate = (varDate) => {
  return dateFormat(varDate, 'mmmm dd, yyyy');
};

export const formatLastSeen = (last_seen) => {
  return last_seen ? dateFormat(new Date(last_seen), 'mm/dd/yyyy HH:MM:ss') : '';
};
