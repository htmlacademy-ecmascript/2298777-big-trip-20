import { remove, render, replace } from '../framework/render';
import ListElementView from '../view/list-element-view';
import EditPointView from '../view/edit-point-view';
import { UserAction, UpdateType } from '../consts';

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
  #handlePointChange;
  #handleModeChange;
  #offers;
  #allOffers;
  #allDestinations;

  constructor({pointContainer, onPointChange, onModeChange, allOffers, allDestinations}) {
    this.#pointContainer = pointContainer;
    this.#handlePointChange = onPointChange;
    this.#handleModeChange = onModeChange;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
  }

  init({point}) {

    if (!this.#initiated) {
      this.#pointView = new ListElementView({
        point,
        onPointButtonClick: this.#handlePointButtonClick,
        onFavoriteButtonClick: this.#handleFavoriteButtonClick,
        getTypeOffers: this.#getTypeOffers,
        allDestinations: this.#allDestinations
      });
      this.#pointEditView = new EditPointView({
        point,
        onPointButtonClick: this.#handleEditPointButtonClick,
        onFormSubmit: this.#handleFormSubmit,
        getOffers: this.#getTypeOffers,
        destinations: this.#allDestinations,
        onDeleteClick: this.#handleDeleteClick,
      });
      render(this.#pointView, this.#pointContainer.element);
      this.#initiated = true;
      return;
    }

    const prevPointView = this.#pointView;
    this.#pointView = new ListElementView(point, this.#handlePointButtonClick, this.#handleFavoriteButtonClick, this.#getTypeOffers, this.#allDestinations);
    const prevPointEditView = this.#pointEditView;
    this.#pointEditView = new EditPointView(point, this.#handleEditPointButtonClick, this.#handleFormSubmit, this.#getTypeOffers, this.#allDestinations, this.#handleDeleteClick);
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

  setSaving = () => {
    this.#pointEditView.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setDeleting = () => {
    this.#pointEditView.updateElement({
      isDisabled: true,
      isDeleting: true,
    });
  };

  setAbortion = () => {
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Modes.EDITING;

    const resetForm = () => {
      this.#pointEditView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditView.shake(resetForm);
  };

  #getTypeOffers = (type) => {
    try {
      this.#offers = this.#allOffers.find((offer) => offer.type === type).offers;
    } catch (err) {
      this.#offers = [];
    }
    return this.#offers;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditView.pointButtonClickHandler(evt);
    }
  };

  #changePointToEditForm() {
    replace(this.#pointEditView, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Modes.EDITING;
  }

  #changeEditFormToPoint() {
    replace(this.#pointView, this.#pointEditView);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Modes.DEFAULT;
  }

  #handleEditPointButtonClick = () => {
    this.#handleModeChange();
  };

  #handlePointButtonClick = () => {
    this.#handleModeChange();
    this.#changePointToEditForm();
  };

  #handleFavoriteButtonClick = (point) => {
    this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...point, isFavorite: !point.isFavorite},
      false,
    );
  };

  #handleFormSubmit = async(state) => {
    this.#mode = Modes.DEFAULT;
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    await this.#handlePointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      state,
    );
  };

  #handleDeleteClick = (point) => {
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#handlePointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
