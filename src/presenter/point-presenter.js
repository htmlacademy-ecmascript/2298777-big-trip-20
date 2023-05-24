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
  #offers;
  #allOffers;
  #allDestinations;

  constructor({pointContainer, onPointChange, onModeChange, allOffers, allDestinations}) {
    this.#pointContainer = pointContainer;
    this.#onPointChange = onPointChange;
    this.#onModeChange = onModeChange;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  init({point}) {

    if (!this.#initiated) {
      this.#pointView = new ListElementView(point, this.#onPointButtonClick, this.#onFavoriteButtonClick, this.#getTypeOffers, this.#allDestinations);
      this.#pointEditView = new EditPointView(point, this.#onEditPointButtonClick, this.#onFormSubmit, this.#getTypeOffers, this.#allDestinations);
      render(this.#pointView, this.#pointContainer.element);
      this.#initiated = true;
      return;
    }

    const prevPointView = this.#pointView;
    this.#pointView = new ListElementView(point, this.#onPointButtonClick, this.#onFavoriteButtonClick, this.#getTypeOffers, this.#allDestinations);
    const prevPointEditView = this.#pointEditView;
    this.#pointEditView = new EditPointView(point,this.#onEditPointButtonClick, this.#onFormSubmit, this.#getTypeOffers, this.#allDestinations);
    if (this.#pointContainer.element.contains(prevPointView.element)) {
      replace(this.#pointView, prevPointView);
    } else {
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

  #onFavoriteButtonClick = (point) => {
    this.#onPointChange({...point, isFavorite: !point.isFavorite});
  };

  #onFormSubmit = (state) => {
    this.#onPointChange(state);
    this.#changeEditFormToPoint();
  };

  #getTypeOffers = (type) => {
    try {
      this.#offers = this.#allOffers.find((offer) => offer.type === type).offers;
    } catch (err) {
      this.#offers = [];
    }
    return this.#offers;
  };
}
