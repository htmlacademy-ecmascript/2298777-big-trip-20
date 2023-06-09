import { UpdateType, UserAction } from '../consts.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import AddNewPointView from '../view/add-new-point-view.js';

export default class NewPointPresenter {
  #listContainer;
  #handlePointChange;
  #newPointComponent;
  #allOffers;
  #allDestinations;
  #addNewPointButton;
  #handleCancelClick;

  constructor({listContainer, allOffers, allDestinations, onPointChange, addNewPointButton, onCancelClick}) {
    this.#listContainer = listContainer;
    this.#handlePointChange = onPointChange;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#addNewPointButton = addNewPointButton;
    this.#handleCancelClick = onCancelClick;
  }

  init() {
    this.#newPointComponent = new AddNewPointView({
      destinations: this.#allDestinations,
      getOffers: this.#getTypeOffers,
      onFormSubmit: this.#handleFormSubmit,
      onCancelClick: this.#handleResetClick,
    });
    document.addEventListener('keydown', this.#escKeyDownHandler);

    render(this.#newPointComponent, this.#listContainer.element, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    this.#addNewPointButton.disabled = false;
    remove(this.#newPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving = () => {
    this.#newPointComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  };

  setAbortion = () => {
    const resetForm = () => {
      this.#newPointComponent.updateElement({
        isDisabled: false,
        isSaving: false,
      });
    };

    this.#newPointComponent.shake(resetForm);
  };

  #getTypeOffers = (type) => {
    let offers;
    try {
      offers = this.#allOffers.find((offer) => offer.type === type).offers;
    } catch (err) {
      offers = [];
    }
    return offers;
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (state) => {
    this.#handlePointChange(UserAction.ADD_POINT, UpdateType.MINOR, state);
  };

  #handleResetClick = () => {
    this.destroy();
    this.#handleCancelClick();
  };
}
