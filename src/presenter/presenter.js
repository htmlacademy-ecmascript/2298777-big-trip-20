import { render } from '../render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EditPointView from '../view/edit-point-view.js';
import ListElementView from '../view/list-element-view.js';

const NUMBER_OF_LIST_ELEMENTS = 3;

export default class ListPresenter {
  #ListContainer;
  #listView = new ListView();

  constructor(ListContainer) {
    this.#ListContainer = ListContainer;
  }

  init() {
    render(new SortView(), this.#ListContainer);
    render(this.#listView, this.#ListContainer);
    render(new EditPointView(), this.#listView.getElement());
    for (let i = 0; i < NUMBER_OF_LIST_ELEMENTS; i++) {
      render(new ListElementView(), this.#listView.getElement());
    }
  }
}
