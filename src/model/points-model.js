import {getDestinationById, getDestinations} from '../mock/destinations';
import {getOfferById, getAllOffers} from '../mock/offers';
import getRandomPoint from '../mock/points';

export default class PointsModel {
  #points = Array.from({length: 4}, getRandomPoint);

  getPoints() {
    return this.#points;
  }

  getDestinationsInfo() {
    return this.#points.map((point) => ({...getDestinationById(point.destination), dateFrom: point.dateFrom, dateTo: point.dateTo, basePrice: point.basePrice, uniqueId: point.uniqueId}));
  }

  getDeparturesInfo() {
    return this.#points.map((point) => getDestinationById(point.id));
  }

  getOffers() {
    return this.#points.map((point) => ({offers: getOfferById(point.type, point.offers), uniqueId: point.uniqueId, dateFrom: point.dateFrom, dateTo: point.dateTo, basePrice: point.basePrice}));
  }

  getOffersWithTypes() {
    return getAllOffers();
  }

  getAllDestinations() {
    return getDestinations();
  }
}
