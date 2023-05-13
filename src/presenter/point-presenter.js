import { remove, render, replace } from '../framework/render';
import ListElementView from '../view/list-element-view';
import EditPointView from '../view/edit-point-view';

const Modes = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointView;
  #pointEditView;
  #initiated = false;
  #mode = Modes.DEFAULT;
  #pointContainer;
  #onPointChange;
  #onModeChange;
  #point;
  #destination;
  #offers;

  constructor({pointContainer, onPointChange, onModeChange}) {
    this.#pointContainer = pointContainer;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
  }


  init({point, destination, offers}) {

    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

    if (!this.#initiated) {
      this.#pointView = new ListElementView(point, destination, offers, this.#onPointButtonClick, this.#onFavoriteButtonClick);
      this.#pointEditView = new EditPointView(point, destination, offers, this.#onEditPointButtonClick);
      render(this.#pointView, this.#pointContainer.element);
      this.#initiated = true;
      return;
    }

    if (this.#pointContainer.element.contains(this.#pointView.element)) {
      const prevPointView = this.#pointView;
      this.#pointView = new ListElementView(point, destination, offers, this.#onPointButtonClick, this.#onFavoriteButtonClick);
      replace(this.#pointView, prevPointView);
    } else {
      const prevPointEditView = this.#pointEditView;
      this.#pointEditView = new EditPointView(point, destination, offers, this.#onEditPointButtonClick);
      replace(this.#pointEditView, prevPointEditView);
    }
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#pointEditView);
  }

  resetView() {
    if (this.#mode !== Modes.DEFAULT) {
      this.#changeEditFormToPoint(this.#pointView, this.#pointEditView);
    }
  }

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#changeEditFormToPoint(this.#pointView, this.#pointEditView);
    }
  };

  #changePointToEditForm() {
    replace(this.#pointEditView, this.#pointView);
    document.addEventListener('keydown', this.#onEscKeydown);
    this.#mode = Modes.EDITING;
  }

  #changeEditFormToPoint() {
    replace(this.#pointView, this.#pointEditView);
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#mode = Modes.DEFAULT;
  }

  #onEditPointButtonClick = () => {
    this.#onModeChange();
  };

  #onPointButtonClick = () => {
    this.#onModeChange();
    this.#changePointToEditForm();
  };

  #onFavoriteButtonClick = () => {
    this.#onPointChange({...this.#point, isFavorite: !this.#point.isFavorite}, this.#destination, this.#offers);
  };
}
