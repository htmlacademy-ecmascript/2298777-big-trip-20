import { render, replace } from '../framework/render';
import EditPointView from '../view/edit-point-view';
import ListElementView from '../view/list-element-view';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListElementPresenter {
  #listElementContainer;
  #points;
  #destinations;
  #offers;

  constructor(listElementContainer, points, destinations, offers) {
    this.#listElementContainer = listElementContainer;
    this.#points = points;
    this.#destinations = destinations;
    this.#offers = offers;
  }

  init() {
    for (let i = 0; i < NUMBER_OF_LIST_ELEMENTS; i++) {
      this.#renderListElement(this.#points[i], this.#destinations[i], this.#offers[i]);
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

    const onFavoriteButtonClick = () => {
      alert('Favorite button clicked');
    };

    const pointView = new ListElementView(point, destination, offers, onPointButtonClick, onFavoriteButtonClick);
    render(pointView, this.#listElementContainer.element);
    const editPointView = new EditPointView(point, destination, offers, onEditPointButtonClick);

    function changePointToEditForm() {
      replace(editPointView, pointView);
    }

    function changeEditFormToPoint() {
      replace(pointView, editPointView);
    }
  }
}
