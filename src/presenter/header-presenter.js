import { render, RenderPosition } from '../framework/render';
import TripInfoView from '../view/trip-main-info-view';
import FilterView from '../view/filter-view';
import { filter } from '../util/filters';

export default class HeaderPresenter {
  #headerContainer;
  #filterContainer;
  #pointModel;

  constructor(headerContainer, filterContainer, pointModel) {
    this.#headerContainer = headerContainer;
    this.#filterContainer = filterContainer;
    this.#pointModel = pointModel;
  }

  init() {
    render(new FilterView(this.#generateFilters()), this.#filterContainer);
    if (this.#pointModel.getPoints().length !== 0) {
      render(new TripInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #generateFilters() {
    return Object.entries(filter).map(([filterName, filterFunction]) => ({
      name: filterName,
      filter: filterFunction(this.#pointModel.getPoints()),
    }));
  }
}
