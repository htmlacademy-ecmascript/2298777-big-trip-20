import { render, replace, remove } from '../framework/render';
import EditPointView from '../view/edit-point-view';
import ListElementView from '../view/list-element-view';

const NUMBER_OF_LIST_ELEMENTS = 4;

export default class ListElementPresenter {
  #listElementContainer;
  #points;
  #destinations;
  #offers;
  #listElements = new Map();
  #editFormElements = new Map();
  #currentPoint = null;

  constructor({listElementContainer, points, destinations, offers}) {
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
        changeEditFormToPoint(this.#listElements.get(point.uniqueId).pointView,
          this.#editFormElements.get(point.uniqueId).editPointView);
        document.removeEventListener('keydown', onEscKeydown);
      }
    };

    const onEditPointButtonClick = (evt) => {
      changeEditFormToPoint(this.#listElements.get(evt.target.dataset.uniqueId).pointView,
        this.#editFormElements.get(evt.target.dataset.uniqueId).editPointView);
      document.removeEventListener('keydown', this.#listElements.get(evt.target.dataset.uniqueId).documentListener);
    };

    const onPointButtonClick = (evt) => {
      this.#currentPoint = point.uniqueId;
      this.#removeAllDocumentsListeners();
      this.destroy();
      this.init();
      changePointToEditForm(this.#listElements.get(evt.target.dataset.uniqueId).pointView,
        this.#editFormElements.get(evt.target.dataset.uniqueId).editPointView);
      document.addEventListener('keydown', this.#listElements.get(evt.target.dataset.uniqueId).documentListener);
    };

    const onFavoriteButtonClick = () => {
      point.isFavorite = !point.isFavorite;
      this.destroy();
      this.init();
    };

    const newPointView = new ListElementView(point, destination, offers, onPointButtonClick, onFavoriteButtonClick);
    this.#listElements.set(point.uniqueId, {pointView: newPointView, documentListener: onEscKeydown});
    render(newPointView, this.#listElementContainer.element);
    const newEditPointView = new EditPointView(point, destination, offers, onEditPointButtonClick);
    this.#editFormElements.set(point.uniqueId, {editPointView: newEditPointView, documentListener: onEscKeydown});

    function changePointToEditForm(pointView, editPointView) {
      replace(editPointView, pointView);
    }

    function changeEditFormToPoint(pointView, editPointView) {
      replace(pointView, editPointView);
    }
  }

  destroy() {
    for (const [id, point] of this.#listElements.entries()) {
      remove(point.pointView);
      this.#listElements.delete(id);
    }
    for (const [id, editForm] of this.#editFormElements.entries()) {
      remove(editForm.editPointView);
      this.#editFormElements.delete(id);
    }
  }

  #removeAllDocumentsListeners() {
    for (const point of this.#listElements.values()) {
      document.removeEventListener('keydown', point.documentListener);
    }
    for (const editForm of this.#editFormElements.values()) {
      document.removeEventListener('keydown', editForm.documentListener);
    }
  }
}
