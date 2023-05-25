import Observable from '../framework/observable';
import { getOfferById, getAllOffers } from '../mock/offers';

export default class OffersModel extends Observable {
  #pointsModel;

  constructor(pointsModel) {
    super();
    this.#pointsModel = pointsModel;
  }

  get activeOffers() {
    return this.#pointsModel.points.map((point) => getOfferById(point.type, point.offers));
  }

  get allOffers() {
    return getAllOffers();
  }
}
