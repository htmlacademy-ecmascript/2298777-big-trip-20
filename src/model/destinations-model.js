import Observable from '../framework/observable';
import { getDestinationById, getDestinations } from '../mock/destinations';

export default class DestinationsModel extends Observable {
  #pointsModel;

  constructor(pointsModel) {
    super();
    this.#pointsModel = pointsModel;
  }

  get currentDestinations() {
    return this.#pointsModel.points.map((point) => getDestinationById(point.destination));
  }

  get allDestinations() {
    return getDestinations();
  }
}
