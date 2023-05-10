import { render } from '../framework/render';
import ListView from '../view/list-view';
import EmptyListView from '../view/list-empty-view';
import ListElementPresenter from './list-element-presenter';
import SortPresenter from './sort-presenter';


export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #listElementPresenter;
  #destinations;
  #offers;
  #sortPresenter;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#destinations = this.#pointsModel.getDestinationsInfo();
    this.#offers = this.#pointsModel.getOffers();
    this.#listElementPresenter = new ListElementPresenter({
      listElementContainer: this.#listView,
      points: this.#points,
      destinations: this.#destinations,
      offers: this.#offers,
    });
    this.#sortPresenter = new SortPresenter({
      SortContainer: this.#listContainer,
      points: this.#points,
      listElementPresenter: this.#listElementPresenter,
    });
  }

  init() {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#listContainer);
    } else {
      this.#sortPresenter.init();
      render(this.#listView, this.#listContainer);
      this.#listElementPresenter.init();
    }
  }
}
