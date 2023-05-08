import { FilterTypes } from '../consts';
import dayjs from 'dayjs';

const filter = {
  [FilterTypes.EVERYTHING]: (events) => events,
  [FilterTypes.FUTURE]: (events) => events.filter((event) => dayjs(event.dateFrom).isAfter(dayjs())),
  [FilterTypes.PRESENT]: (events) => events.filter((event) => dayjs(event.dateFrom).isBefore(dayjs()) && dayjs(event.dateTo).isAfter(dayjs())),
  [FilterTypes.PAST]: (events) => events.filter((event) => dayjs(event.dateTo).isBefore(dayjs())),
};

export { filter };
