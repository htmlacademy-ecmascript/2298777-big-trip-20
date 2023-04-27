import { render, RenderPosition } from '../render';
import TripInfoView from '../view/trip-main-info-view';

export default class HeaderPresenter {
  #headerContainer;

  constructor(headerContainer) {
    this.#headerContainer = headerContainer;
  }

  init() {
    render(new TripInfoView(), this.#headerContainer, RenderPosition.AFTERBEGIN);
  }
}
