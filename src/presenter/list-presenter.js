import { render } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import ListElementPresenter from './list-element-presenter';


export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #destinations;
  #offers;
  #listElementPresenter;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#destinations = this.#pointsModel.getDestinationsInfo();
    this.#offers = this.#pointsModel.getOffers();
    this.#listElementPresenter = new ListElementPresenter(this.#listView, this.#points, this.#destinations, this.#offers);
  }

  init() {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#listContainer);
    } else {
      render(new SortView(), this.#listContainer);
      render(this.#listView, this.#listContainer);
      this.#listElementPresenter.init();
    }
  }
}
