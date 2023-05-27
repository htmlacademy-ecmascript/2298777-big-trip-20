const DateFormats = {
  MONTH_WITH_DAY: 'MMMM DD',
  NORMAL: 'YYYY-MM-DD',
  TIME: 'HH:mm',
  FULL_DATE: 'YYYY-MM-DDTHH:mm',
  SLASH_FULL_DATE: 'DD/MM/YY HH:mm',
};

const Types = {
  TAXI: 'taxi',
  BUS: 'bus',
  TRAIN: 'train',
  SHIP: 'ship',
  DRIVE: 'drive',
  FLIGHT: 'flight',
  CHECK_IN: 'check-in',
  SIGHTSEEING: 'sightseeing',
  RESTAURANT: 'restaurant',
};

const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

const SortTypes = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers',
};

export { DateFormats, Types, FilterTypes, SortTypes };
