import { render } from '../framework/render';
import SortView from '../view/sort-view.js';
import { sort } from '../util/sorts';
import SortElementView from '../view/sort-element-view';
import { SortTypes } from '../consts';

export default class SortPresenter {
  #sortContainer;
  #points;
  #listPresenter;
  #sortView = new SortView();

  constructor({SortContainer, points, listPresenter}) {
    this.#sortContainer = SortContainer;
    this.#points = points;
    this.#listPresenter = listPresenter;
  }

  init() {
    render(this.#sortView, this.#sortContainer);
    for (const sortElement of this.#generateSorts()) {
      const sortElementView = new SortElementView(sortElement);
      render(sortElementView, this.#sortView.element);
      if (sortElement.name !== SortTypes.EVENT && sortElement.name !== SortTypes.OFFERS) {
        sortElementView.addSortClickHandler();
      }
    }
  }

  #generateSorts() {
    return Object.entries(sort).map(([sortName, sortFunction]) => ({
      name: sortName,
      sort: () => {
        if (sortName !== SortTypes.EVENT && sortName !== SortTypes.OFFERS) {
          this.#listPresenter.destroy();
          this.#listPresenter.renderPoints({points: sortFunction(this.#points)});
        }
      }
    }));
  }
}
