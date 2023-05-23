import { render } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import { updateItemByUniqueId, getDiffInSeconds } from '../util/utils';
import { SortTypes } from '../consts';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #originalPoints;
  #destinations;
  #originalDestinations;
  #originalOffers;
  #offers;
  #offersWithTypes;
  #pointPresenters = new Map();
  #currentSortType = SortTypes.DAY;
  #allDestinations;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = [...this.#pointsModel.getPoints()];
    this.#originalPoints = [...this.#pointsModel.getPoints()];
    this.#originalDestinations = [...this.#pointsModel.getDestinationsInfo()];
    this.#destinations = [...this.#pointsModel.getDestinationsInfo()];
    this.#offers = [...this.#pointsModel.getOffers()];
    this.#originalOffers = [...this.#pointsModel.getOffers()];
    this.#offersWithTypes = [...this.#pointsModel.getOffersWithTypes()];
    this.#allDestinations = [...this.#pointsModel.getAllDestinations()];
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
        allOffers: this.#offersWithTypes,
        allDestinations: this.#allDestinations,
      });
      point.init({
        point: this.#points[i],
      });
      this.#pointPresenters.set(this.#points[i].uniqueId, point);
    }
  }

  destroy() {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();
  }

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItemByUniqueId(this.#points, updatedPoint);
    this.#originalPoints = updateItemByUniqueId(this.#originalPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.uniqueId).init({point: updatedPoint});
  };

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #sortPoints = (sortType) => {
    const sortable = [...this.#points].map((value, index) => [this.#points[index], this.#destinations[index], this.#offers[index]]);
    switch (sortType) {
      case SortTypes.TIME:
        sortable.sort((a, b) => getDiffInSeconds(b[0].dateTo, b[0].dateFrom) - getDiffInSeconds(a[0].dateTo, a[0].dateFrom));
        this.#points = sortable.slice().map((items) => items[0]);
        this.#destinations = sortable.slice().map((items) => items[1]);
        this.#offers = sortable.slice().map((items) => items[2]);
        break;
      case SortTypes.PRICE:
        sortable.sort((a, b) => b[0].basePrice - a[0].basePrice);
        this.#points = sortable.slice().map((items) => items[0]);
        this.#destinations = sortable.slice().map((items) => items[1]);
        this.#offers = sortable.slice().map((items) => items[2]);
        break;
      default:
        this.#points = [...this.#originalPoints];
        this.#destinations = [...this.#originalDestinations];
        this.#offers = [...this.#originalOffers];
    }
  };


  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#points = [...this.#originalPoints];
    this.#destinations = [...this.#originalDestinations];
    this.#offers = [...this.#originalOffers];
    this.#sortPoints(sortType);
    this.destroy();
    this.renderPoints();
  };
}
