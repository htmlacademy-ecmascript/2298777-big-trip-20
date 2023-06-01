import Observable from '../framework/observable';
import { UpdateType } from '../consts';

export default class OffersModel extends Observable {
  #pointsModel;
  #offers = [];

  constructor({pointsModel}) {
    super();
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleInitEvent);
  }

  get activeOffers() {
    return this.#pointsModel.points.map((point) => {
      const offer = this.#offers.find((item) => item.type === point.type);
      if (!offer) {
        return [];
      }
      const offerById = offer.offers.filter((item) => point.offers.includes(item.id));
      return offerById;
    });
  }

  get allOffers() {
    return this.#offers;
  }

  #handleInitEvent = (updateType, offers) => {
    if (updateType === UpdateType.OFFERS) {
      this.#offers = offers;
    }
  };
}
