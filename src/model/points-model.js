import Observable from '../framework/observable';
import { getDiffInSeconds } from '../util/utils';
import { UpdateType } from '../consts';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #pointsApiService;

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points.sort((a, b) => getDiffInSeconds(a.dateFrom, b.dateFrom));
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update nonexistent task');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0, index),
        updatedPoint,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updatedPoint);
    } catch (error) {
      throw new Error('Can\'t update task');
    }
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.createPoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        updatedPoint,
        ...this.#points,
      ];
      this._notify(updateType, updatedPoint);
    } catch (error) {
      throw new Error('Can\'t add task');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete nonexistent task');
    }

    try {
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (error) {
      throw new Error('Can\'t delete task');
    }
  }

  async init() {
    try {
      this.#points = (await this.#pointsApiService.points).map(this.#adaptToClient);
    } catch (error) {
      this.#points = [];
      this._notify(UpdateType.ERROR, error.message);
      return;
    }

    try {
      this.#destinations = await this.#pointsApiService.destinations;
      this._notify(UpdateType.DESTINATIONS, this.#destinations);
    } catch (error) {
      this.#points = [];
      this._notify(UpdateType.ERROR, error.message);
      return;
    }

    try {
      this.#offers = await this.#pointsApiService.offers;
      this._notify(UpdateType.OFFERS, this.#offers);
    } catch (error) {
      this.#points = [];
      this._notify(UpdateType.ERROR, error.message);
      return;
    }

    this._notify(UpdateType.INIT);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
      isFavorite: point['is_favorite']
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
