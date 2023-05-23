import dayjs from 'dayjs';

const getRandomArrayElement = (array) => array[Math.floor(Math.random() * array.length)];

const humanizeDate = (date, format) => dayjs(date).format(format);

const getTimeDiff = (dateTo, dateFrom) => `${dayjs(dateTo).diff(dayjs(dateFrom), 'hour')}H ${dayjs(dateTo).diff(dayjs(dateFrom), 'minute') % 60}M`;

const getDiffInSeconds = (dateTo, dateFrom) => dayjs(dateTo).diff(dayjs(dateFrom), 'second');

const updateItemByUniqueId = (items, update) => items.map((item) => item.uniqueId === update.uniqueId ? update : item);

const getIndexByUniqueId = (items, uniqueId) => items.findIndex((item) => item.uniqueId === uniqueId);

export { getRandomArrayElement, humanizeDate, getTimeDiff, getDiffInSeconds, updateItemByUniqueId, getIndexByUniqueId };
