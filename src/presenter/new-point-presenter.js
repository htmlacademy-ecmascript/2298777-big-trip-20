import { UpdateType, UserAction } from '../consts.js';
import { RenderPosition, remove, render } from '../framework/render.js';
import AddNewPointView from '../view/add-new-point-view.js';

export default class NewPointPresenter {
  #listContainer;
  #onPointChange;
  #newPointComponent;
  #allOffers;
  #allDestinations;
  #addNewPointButton;
  #onCancelClick;

  constructor({listContainer, allOffers, allDestinations, onPointChange, addNewPointButton, onCancelClick}) {
    this.#listContainer = listContainer;
    this.#onPointChange = onPointChange;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#addNewPointButton = addNewPointButton;
    this.#onCancelClick = onCancelClick;
  }

  init() {
    this.#newPointComponent = new AddNewPointView({
      destinations: this.#allDestinations,
      getOffers: this.#getTypeOffers,
      onFormSubmit: this.#onFormSubmit,
      onCancelClick: this.#onResetClick,
    });
    document.addEventListener('keydown', this.#onEscKeyDown);

    render(this.#newPointComponent, this.#listContainer.element, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    this.#addNewPointButton.disabled = false;
    remove(this.#newPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
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

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onFormSubmit = (state) => {
    this.#onPointChange(UserAction.ADD_POINT, UpdateType.MINOR, state);
  };

  #onResetClick = () => {
    this.destroy();
    this.#onCancelClick();
  };
}
