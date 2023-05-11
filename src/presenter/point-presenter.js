import { remove, render, replace } from '../framework/render';
import ListElementView from '../view/list-element-view';
import EditPointView from '../view/edit-point-view';

const Modes = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointContainer;
  #pointView;
  #pointEditView;
  #initiated = false;
  #onPointChange;
  #point;
  #destination;
  #offers;
  #onModeChange;
  #mode = Modes.DEFAULT;

  constructor({pointContainer, onModeChange, onPointChange, point, destination, offers}) {
    this.#pointContainer = pointContainer;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
  }

  init({point = this.#point, destination = this.#destination, offers = this.#offers}) {
    const onEditPointButtonClick = () => {
      this.#onModeChange();
    };

    const onPointButtonClick = () => {
      this.#onModeChange();
      this.#changePointToEditForm();
    };

    const onFavoriteButtonClick = () => {
      this.#onPointChange({...point, isFavorite: !point.isFavorite});
    };

    if (!this.#initiated) {
      this.#pointView = new ListElementView(point, destination, offers, onPointButtonClick, onFavoriteButtonClick);
      this.#pointEditView = new EditPointView(point, destination, offers, onEditPointButtonClick);
      render(this.#pointView, this.#pointContainer.element);
      this.#initiated = true;
      return;
    }

    if (this.#pointContainer.element.contains(this.#pointView.element)) {
      const prevPointView = this.#pointView;
      this.#pointView = new ListElementView(point, destination, offers, onPointButtonClick, onFavoriteButtonClick);
      replace(this.#pointView, prevPointView);
    } else {
      const prevPointEditView = this.#pointEditView;
      this.#pointEditView = new EditPointView(point, destination, offers, onEditPointButtonClick);
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
}
