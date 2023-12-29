import moment from 'moment';

export const messageDate = ({ timestamp, format = 'h:mm A' }) => {
  const jsDate = timestamp?.toDate();

  const formattedTime = moment(jsDate).format(format);

  return formattedTime;
};
