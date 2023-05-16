import { render } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import { updateItem } from '../util/utils';
import { SortTypes } from '../consts';
import { getDiffInSeconds } from '../util/utils';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #originalPoints;
  #destinations;
  #offers;
  #pointPresenters = new Map();
  #currentSortType = SortTypes.DAY;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.getPoints()];
    this.#originalPoints = [...this.#pointsModel.getPoints()];
    this.#destinations = [...this.#pointsModel.getDestinationsInfo()];
    this.#offers = [...this.#pointsModel.getOffers()];
  }

  init() {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#listContainer);
    } else {
      render(new SortView({
        sorts: Object.values(SortTypes),
        onSortChange: this.#handleSortChange,
      }), this.#listContainer);
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
    this.#originalPoints = updateItem(this.#originalPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.uniqueId).init({point: updatedPoint, destination: updatedDestination, offers: offers});
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #sortPoints = (sortType) => {
    switch (sortType) {
      case SortTypes.TIME:
        this.#points = this.#points.slice().sort((a, b) => getDiffInSeconds(b.dateTo, b.dateFrom) - getDiffInSeconds(a.dateTo, a.dateFrom));
        break;
      case SortTypes.PRICE:
        this.#points = this.#points.slice().sort((a, b) => b.basePrice - a.basePrice);
        break;
      default:
        this.#points = [...this.#originalPoints];
    }
  };


  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#points = [...this.#originalPoints];
    this.#sortPoints(sortType);
    this.destroy();
    this.renderPoints();
  };
}
