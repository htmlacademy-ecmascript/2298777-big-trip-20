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
      this.#pointView = new ListElementView({
        point,
        onPointButtonClick: this.#onPointButtonClick,
        onFavoriteButtonClick: this.#onFavoriteButtonClick,
        getTypeOffers: this.#getTypeOffers,
        allDestinations: this.#allDestinations
      });
      this.#pointEditView = new EditPointView({
        point,
        onPointButtonClick: this.#onEditPointButtonClick,
        onFormSubmit: this.#onFormSubmit,
        getOffers: this.#getTypeOffers,
        destinations: this.#allDestinations,
        onDeleteClick: this.#onDeleteClick,
      });
      render(this.#pointView, this.#pointContainer.element);
      this.#initiated = true;
      return;
    }

    const prevPointView = this.#pointView;
    this.#pointView = new ListElementView(point, this.#onPointButtonClick, this.#onFavoriteButtonClick, this.#getTypeOffers, this.#allDestinations);
    const prevPointEditView = this.#pointEditView;
    this.#pointEditView = new EditPointView(point, this.#onEditPointButtonClick, this.#onFormSubmit, this.#getTypeOffers, this.#allDestinations, this.#onDeleteClick);
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
    document.addEventListener('keydown', this.#onEscKeydown);
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

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditView.handlePointButtonClick(evt);
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
    this.#onPointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...point, isFavorite: !point.isFavorite},
      false,
    );
  };

  #onFormSubmit = async(state) => {
    this.#mode = Modes.DEFAULT;
    document.removeEventListener('keydown', this.#onEscKeydown);
    await this.#onPointChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      state,
    );
  };

  #onDeleteClick = (point) => {
    document.removeEventListener('keydown', this.#onEscKeydown);
    this.#onPointChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };
}
