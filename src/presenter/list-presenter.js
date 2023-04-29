import { render } from '../render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EditPointView from '../view/edit-point-view.js';
import ListElementView from '../view/list-element-view.js';

const NUMBER_OF_LIST_ELEMENTS = 3;

export default class ListPresenter {
  #listContainer;
  #listView = new ListView();

  constructor(listContainer) {
    this.#listContainer = listContainer;
  }

  init() {
    render(new SortView(), this.#listContainer);
    render(this.#listView, this.#listContainer);
    render(new EditPointView(), this.#listView.getElement());
    for (let i = 0; i < NUMBER_OF_LIST_ELEMENTS; i++) {
      render(new ListElementView(), this.#listView.getElement());
    }
  }
}
