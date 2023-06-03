import Observable from '../framework/observable';
import { getDiffInSeconds } from '../util/utils';
import { UpdateType } from '../consts';

export default class PointsModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];
  #pointsAPiService;
  #destinationsAPiService;
  #offersAPiService;

  constructor({pointsAPiService, destinationsAPiService, offersAPiService}) {
    super();
    this.#pointsAPiService = pointsAPiService;
    this.#destinationsAPiService = destinationsAPiService;
    this.#offersAPiService = offersAPiService;
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
      const response = await this.#pointsAPiService.updatePoint(update);
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
      const response = await this.#pointsAPiService.createPoint(update);
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
      await this.#pointsAPiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch (error) {
      throw new Error('Can\'t delete task');
    }
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

  async init() {
    try {
      this.#points = (await this.#pointsAPiService.points).map(this.#adaptToClient);
    } catch (error) {
      this.#points = [];
    }

    try {
      this.#destinations = await this.#destinationsAPiService.destinations;
    } catch (error) {
      this.#destinations = [];
    }
    this._notify(UpdateType.DESTINATIONS, this.#destinations);

    try {
      this.#offers = await this.#offersAPiService.offers;
    } catch (error) {
      this.#offers = [];
    }
    this._notify(UpdateType.OFFERS, this.#offers);

    this._notify(UpdateType.INIT);
  }
}
