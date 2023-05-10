import { render } from '../framework/render';
import SortView from '../view/sort-view.js';
import { sort } from '../util/sorts';
import SortElementView from '../view/sort-element-view';
import { SortTypes } from '../consts';

export default class SortPresenter {
  #sortContainer;
  #points;
  #listElementPresenter;
  #sortView = new SortView();

  constructor({SortContainer, points, listElementPresenter}) {
    this.#sortContainer = SortContainer;
    this.#points = points;
    this.#listElementPresenter = listElementPresenter;
  }

  init() {
    render(this.#sortView, this.#sortContainer);
    for (const sortElement of this.#generateSorts()) {
      const sortElementView = new SortElementView(sortElement);
      render(sortElementView, this.#sortView.element);
      sortElementView.addSortClickHandler();
    }
  }

  #generateSorts() {
    return Object.entries(sort).map(([sortName, sortFunction]) => ({
      name: sortName,
      sort: () => {
        if (sortName !== SortTypes.EVENT || sortName !== SortTypes.OFFERS) {
          this.#listElementPresenter.destroy();
          this.#listElementPresenter.init(sortFunction(this.#points));
        } else {
          return false;
        }
      }
    }));
  }
}
