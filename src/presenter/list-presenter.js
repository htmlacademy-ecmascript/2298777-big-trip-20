import { render } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import { getDiffInSeconds } from '../util/utils';
import { SortTypes, UpdateType, UserAction } from '../consts';

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #destinationsModel;
  #offersModel;
  #listView = new ListView();
  #offersWithTypes;
  #pointPresenters = new Map();
  #currentSortType = SortTypes.DAY;
  #allDestinations;

  constructor(listContainer, pointsModel, destinationsModel, offersModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#offersWithTypes = [...offersModel.allOffers];
    this.#allDestinations = [...destinationsModel.allDestinations];
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return this.#sortPoints(this.#currentSortType, 'points');
  }

  get destinations() {
    return this.#sortPoints(this.#currentSortType, 'destinations');
  }

  get offers() {
    return this.#sortPoints(this.#currentSortType, 'offers');
  }

  init() {
    if (this.points.length === 0) {
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
    for(let i = 0; i < this.points.length; i++) {
      const point = new PointPresenter({
        pointContainer: this.#listView,
        onPointChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
        allOffers: this.#offersWithTypes,
        allDestinations: this.#allDestinations,
      });
      point.init({
        point: this.points[i],
      });
      this.#pointPresenters.set(this.points[i].uniqueId, point);
    }
  }

  destroy({resetSortType = false} = {}) {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #sortPoints = (sortType, returnType) => {
    const sortable = [...this.#pointsModel.points].map(
      (value, index) => [this.#pointsModel.points[index], this.#destinationsModel.currentDestinations[index], this.#offersModel.activeOffers[index]]
    );
    switch (sortType) {
      case SortTypes.TIME:
        sortable.sort((a, b) => getDiffInSeconds(b[0].dateTo, b[0].dateFrom) - getDiffInSeconds(a[0].dateTo, a[0].dateFrom));
        break;
      case SortTypes.PRICE:
        sortable.sort((a, b) => b[0].basePrice - a[0].basePrice);
        break;
    }
    if (returnType === 'points') {
      return sortable.map((value) => value[0]);
    } else if (returnType === 'destinations') {
      return sortable.map((value) => value[1]);
    } else if (returnType === 'offers') {
      return sortable.map((value) => value[2]);
    }
  };


  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    //this.#sortPoints(sortType);
    this.destroy();
    this.renderPoints();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.uniqueId).init(data);
        break;
      case UpdateType.MINOR:
        this.destroy();
        this.renderPoints();
        break;
      case UpdateType.MAJOR:
        this.destroy({resetSortType: true});
        this.renderPoints();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };
}
