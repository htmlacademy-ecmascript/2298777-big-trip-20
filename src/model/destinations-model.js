import Observable from '../framework/observable';
import { UpdateType } from '../consts';

export default class DestinationsModel extends Observable {
  #pointsModel;
  #destinations = [];

  constructor({pointsModel}) {
    super();
    this.#pointsModel = pointsModel;
    this.#pointsModel.addObserver(this.#handleInitEvent);
  }

  get currentDestinations() {
    return this.#pointsModel.points.map((point) => this.#destinations.find((destination) => destination.id === point.destination));
  }

  get allDestinations() {
    return this.#destinations;
  }

  #handleInitEvent = (updateType, destinations) => {
    if (updateType === UpdateType.DESTINATIONS) {
      this.#destinations = destinations;
    }
  };
}
