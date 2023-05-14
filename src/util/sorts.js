import { SortTypes } from '../consts';
import { getDiffInSeconds } from './utils';

const sort = {
  [SortTypes.DAY]: (events) => events,
  [SortTypes.EVENT]: (events) => events,
  [SortTypes.TIME]: (events) => events.slice().sort((a, b) => getDiffInSeconds(b.dateTo, b.dateFrom) - getDiffInSeconds(a.dateTo, a.dateFrom)),
  [SortTypes.PRICE]: (events) => events.slice().sort((a, b) => b.basePrice - a.basePrice),
  [SortTypes.OFFERS]: (events) => (events),
};

export { sort };
