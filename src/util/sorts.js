import {SortTypes} from '../consts';
import {getDiffInSeconds} from './utils';

export default {
  [SortTypes.TIME]: (a, b) => getDiffInSeconds(b.dateTo, b.dateFrom) - getDiffInSeconds(a.dateTo, a.dateFrom),
  [SortTypes.PRICE]: (a, b) => b.basePrice - a.basePrice,
};
