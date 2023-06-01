import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filters, currentFilterType) => filters.map(({ type, count }) =>
  `<div class="trip-filters__filter">
    <input id="filter-${type}"
      class="trip-filters__filter-input  visually-hidden"
      type="radio"
      name="trip-filter"
      value="${type}"
      ${count === 0 ? 'disabled' : ''}
      ${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>`).join('');

const createFilterTemplate = (filters, currentFilterType) =>
  `<form class="trip-filters" action="#" method="get">
    ${createFilterItemTemplate(filters, currentFilterType)}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;

export default class FilterView extends AbstractView {
  #filters;
  #currentFilterType;
  #onFilterChange;

  constructor({filters, currentFilterType, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
    this.#onFilterChange = onFilterChange;

    this.element.addEventListener('change', this.#handleFilterChange);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilterType);
  }

  #handleFilterChange = (evt) => {
    evt.preventDefault();
    this.#onFilterChange(evt.target.value);
  };

}
