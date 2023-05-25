import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  months: [
    'Jan.', 'Feb.', 'March', 'Apr.', 'May', 'June', 'July',
    'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'
  ]
});

const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

const humanizeDate = (date, format) => dayjs(date).format(format);

const getTimeDiff = (dateTo, dateFrom) => {
  const days = dayjs(dateTo).diff(dayjs(dateFrom), 'day');
  const hours = dayjs(dateTo).diff(dayjs(dateFrom), 'hour') % 24;
  const minutes = dayjs(dateTo).diff(dayjs(dateFrom), 'minute') % 60;
  if (days > 0) {
    return `${days}D ${hours}H ${minutes}M`;
  } else if (hours > 0) {
    return `${hours}H ${minutes}M`;
  }
  return `${minutes}M`;
};

const getDiffInSeconds = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom), 'second');

const updateItemByUniqueId = (items, update) => items.map((item) => item.uniqueId === update.uniqueId ? update : item);

export { getRandomArrayElement, humanizeDate, getTimeDiff, getDiffInSeconds, updateItemByUniqueId };
