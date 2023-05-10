import { SortTypes } from '../consts';
import { getDiffInSeconds } from './utils';

const sort = {
  [SortTypes.DAY]: (events) => events,
  [SortTypes.EVENT]: () => null,
  [SortTypes.TIME]: (events) => events.slice().sort((a, b) => getDiffInSeconds(a.dateTo, a.dateFrom) - getDiffInSeconds(b.dateTo, b.dateFrom)),
  [SortTypes.PRICE]: (events) => events.slice().sort((a, b) => a.basePrice - b.basePrice),
  [SortTypes.OFFERS]: () => null,
};

export { sort };
