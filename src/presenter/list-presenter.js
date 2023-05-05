import { render, replace } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import ListElementView from '../view/list-element-view';
import EditPointView from '../view/edit-point-view';
import EmptyListView from '../view/list-empty-view';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #listView = new ListView();
  #points;
  #destination;
  #offers;

  constructor(listContainer, pointsModel) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#points = this.#pointsModel.getPoints();
    this.#destination = this.#pointsModel.getDestinationsInfo();
    this.#offers = this.#pointsModel.getOffers();
  }

  init() {
    if (this.#points.length === 0) {
      render(new EmptyListView(), this.#listContainer);
    } else {
      render(new SortView(), this.#listContainer);
      render(this.#listView, this.#listContainer);
      for (let i = 0; i < NUMBER_OF_LIST_ELEMENTS; i++) {
        this.#renderListElement(this.#points[i], this.#destination[i], this.#offers[i]);
      }
    }
  }

  #renderListElement(point, destination, offers) {
    const onEscKeydown = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        changeEditFormToPoint();
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const onPointButtonClick = () => {
      changePointToEditForm();
      document.addEventListener('keydown', onEscKeydown);
    };

    const onEditPointButtonClick = () => {
      changeEditFormToPoint();
      document.removeEventListener('keydown', onEscKeydown);
    };

    const pointView = new ListElementView(point, destination, offers, onPointButtonClick);
    render(pointView, this.#listView.element);
    const editPointView = new EditPointView(point, destination, offers, onEditPointButtonClick);

    function changePointToEditForm() {
      replace(editPointView, pointView);
    }

    function changeEditFormToPoint() {
      replace(pointView, editPointView);
    }
  }
}
