import AbstractView from '../framework/view/abstract-view.js';
import { SortTypes } from '../consts.js';

const createSortTemplates = (sorts) =>
  sorts.map((sort) => /*html*/
    `<div class="trip-sort__item  trip-sort__item--${sort}">
      <input id="sort-${sort}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort}"
      ${sort === SortTypes.EVENT || sort === SortTypes.OFFERS ? 'disabled' : ''} ${sort === SortTypes.DAY ? 'checked' : ''}
      data-sort-type="${sort}">
      <label class="trip-sort__btn" for="sort-${sort}">${sort}</label>
    </div>`).join('');

const createSortTemplate = (sorts) => /*html*/`
<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${createSortTemplates(sorts)}
</form>`;

export default class SortView extends AbstractView{
  #sorts;
  #onSortChange;

  constructor({sorts, onSortChange}) {
    super();
    this.#sorts = sorts;
    this.#onSortChange = onSortChange;

    this.element.addEventListener('change', this.#handleSortChange);
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  #handleSortChange = (evt) => {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    this.#onSortChange(evt.target.dataset.sortType);
  };
}
