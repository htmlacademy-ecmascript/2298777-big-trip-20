import {getDestinationById} from '../mock/destinations';
import {getOfferById, getAllOffers} from '../mock/offers';
import getRandomPoint from '../mock/points';

export default class PointsModel {
  #points = Array.from({length: 4}, getRandomPoint);

  getPoints() {
    return this.#points;
  }

  getDestinationsInfo() {
    return this.#points.map((point) => ({...getDestinationById(point.destination), dateFrom: point.dateFrom, dateTo: point.dateTo, basePrice: point.basePrice}));
  }

  getDeparturesInfo() {
    return this.#points.map((point) => getDestinationById(point.id));
  }

  getOffers() {
    return this.#points.map((point) => getOfferById(point.type, point.offers));
  }

  getOffersWithTypes() {
    return getAllOffers();
  }
}
