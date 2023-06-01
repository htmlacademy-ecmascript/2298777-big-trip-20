import { filter } from '../util/filters';
import { FilterTypes, UpdateType } from '../consts';
import FilterView from '../view/filter-view';
import { remove, render, replace } from '../framework/render';

export default class FilterPresenter {
  #filterContainer;
  #filterModel;
  #pointsModel;
  #filterComponent = null;
  #prevFilterComponent = null;

  constructor({ filterContainer, filterModel, pointsModel }) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    return Object.values(FilterTypes).map((filterType) => ({
      type: filterType,
      count: filter[filterType]([...this.#pointsModel.points]).length,
    }));
  }

  init() {
    this.#prevFilterComponent = this.#filterComponent;
    this.#filterComponent = new FilterView({
      filters: this.filters,
      currentFilterType: this.#filterModel.filter,
      onFilterChange: this.#handleFilterChange,
    });

    if (this.#prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainer);
      return;
    }

    replace(this.#filterComponent, this.#prevFilterComponent);
    remove(this.#prevFilterComponent);
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterChange = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
