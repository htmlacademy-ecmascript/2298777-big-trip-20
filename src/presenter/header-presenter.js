import { render, RenderPosition } from '../framework/render';
import TripInfoView from '../view/trip-main-info-view';
import FilterView from '../view/filter-view';

export default class HeaderPresenter {
  #headerContainer;
  #filterContainer;

  constructor(headerContainer, filterContainer) {
    this.#headerContainer = headerContainer;
    this.#filterContainer = filterContainer;
  }

  init() {
    render(new FilterView(), this.#filterContainer);
    render(new TripInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
  }
}
