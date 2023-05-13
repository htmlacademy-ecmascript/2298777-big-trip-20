import { render } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import { updateItem } from '../util/utils';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #destinations;
  #offers;
  #pointPresenters = new Map();

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#destinations = this.#pointsModel.getDestinationsInfo();
    this.#offers = this.#pointsModel.getOffers();
  }

  init() {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#listContainer);
    } else {
      render(new SortView(), this.#listContainer);
      render(this.#listView, this.#listContainer);
      this.renderPoints();
    }
  }

  renderPoints() {
    for(let i = 0; i < NUMBER_OF_LIST_ELEMENTS; i++) {
      const point = new PointPresenter({
        pointContainer: this.#listView,
        onPointChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });
      point.init({
        point: this.#points[i],
        destination: this.#destinations[i],
        offers: this.#offers[i],
      });
      this.#pointPresenters.set(this.#points[i].uniqueId, point);
    }
  }

  destroy() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint, updatedDestination, offers) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.uniqueId).init({point: updatedPoint, destination: updatedDestination, offers: offers});
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };
}
