import getRandomPoint from '../mock/points';
import Observable from '../framework/observable';

export default class PointsModel extends Observable {
  #points = Array.from({length: 4}, getRandomPoint);

  get points() {
    return this.#points;
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.uniqueId === update.uniqueId);

    if (index === -1) {
      throw new Error('Can\'t update nonexistent task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.uniqueId === update.uniqueId);

    if (index === -1) {
      throw new Error('Can\'t delete nonexistent task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
