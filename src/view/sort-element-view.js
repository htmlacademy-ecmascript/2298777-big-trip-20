import AbstractView from '../framework/view/abstract-view';
import { SortTypes } from '../consts';

const createSortTemplate = (sort) => /* html */
  `<div class="trip-sort__item  trip-sort__item--${sort.name}">
    <input id="sort-${sort.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort.name}"
    ${sort.name === SortTypes.EVENT || sort.name === SortTypes.OFFERS ? 'disabled' : ''}>
    <label class="trip-sort__btn" for="sort-${sort.name}">${sort.name}</label>
  </div>`;

export default class SortElementView extends AbstractView {
  #sort;

  constructor(sort) {
    super();
    this.#sort = sort;
  }

  get template() {
    return createSortTemplate(this.#sort);
  }

  addSortClickHandler() {
    this.element.addEventListener('click', this.#sort.sort);
  }
}
