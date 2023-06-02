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

const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  DESTINATIONS: 'DESTINATIONS',
  OFFERS: 'OFFERS',
};

const ApiMethods = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export { DateFormats, Types, FilterTypes, SortTypes, UserAction, UpdateType, ApiMethods };
