import { getRandomArrayElement } from '../util/utils';

const points = [
  {
    id: '1',
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T12:22:13.375Z',
    destination: '2',
    isFavorite: false,
    offers: [
      '1'
    ],
    type: 'taxi'
  },
  {
    id: '2',
    basePrice: 200,
    dateFrom: '2019-07-12T20:55:56.845Z',
    dateTo: '2019-07-13T11:22:13.375Z',
    destination: '3',
    isFavorite: true,
    offers: [
      '1',
      '2'
    ],
    type: 'flight'
  },
  {
    id: '3',
    basePrice: 5000,
    dateFrom: '2019-07-14T10:55:56.845Z',
    dateTo: '2019-07-15T20:12:13.375Z',
    destination: '4',
    isFavorite: false,
    offers: [
      '1'
    ],
    type: 'ship'
  },
  {
    id: '4',
    basePrice: 1,
    dateFrom: '2019-07-16T12:55:56.845Z',
    dateTo: '2019-07-17T15:22:13.375Z',
    destination: '5',
    isFavorite: true,
    offers: [
      '1',
      '2',
      '3'
    ],
    type: 'train'
  }
];

const getRandomPoint = () => getRandomArrayElement(points);


export default getRandomPoint;
