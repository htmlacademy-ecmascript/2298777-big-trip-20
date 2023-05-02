import { render } from '../render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EditPointView from '../view/edit-point-view.js';
import ListElementView from '../view/list-element-view.js';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #destination;
  #offers;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#destination = this.#pointsModel.getDestinationsInfo();
    this.#offers = this.#pointsModel.getOffers();
  }

  init() {
    render(new SortView(), this.#listContainer);
    render(this.#listView, this.#listContainer);
    render(new EditPointView(this.#points[0], this.#destination[0], this.#offers[0]), this.#listView.getElement());
    for (let i = 1; i < NUMBER_OF_LIST_ELEMENTS; i++) {
      render(new ListElementView(this.#points[i], this.#destination[i], this.#offers[i]), this.#listView.getElement());
    }
  }
}
