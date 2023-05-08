import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypes } from '../consts.js';

const createFilterItemTemplate = (filters) => filters.map(({ name, filter }) =>
  `<div class="trip-filters__filter">
    <input id="filter-${name}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${name}"
      ${filter.length === 0 ? 'disabled' : ''}
      ${name === FilterTypes.EVERYTHING ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
  </div>`).join('');

const createFilterTemplate = (filters) =>
  `<form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filters)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }
}
