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

  constructor({listContainer, allOffers, allDestinations, onPointChange, addNewPointButton}) {
    this.#listContainer = listContainer;
    this.#onPointChange = onPointChange;
    this.#allOffers = allOffers;
    this.#allDestinations = allDestinations;
    this.#addNewPointButton = addNewPointButton;
  }

  init() {
    this.#newPointComponent = new AddNewPointView({
      destinations: this.#allDestinations,
      getOffers: this.#getTypeOffers,
      onFormSubmit: this.#onFormSubmit,
      onCancel: this.#onCancel,
    });
    document.addEventListener('keydown', this.#onEscKeyDown);

    render(this.#newPointComponent, this.#listContainer.element, RenderPosition.AFTERBEGIN);
  }

  destroy() {
    this.#addNewPointButton.disabled = false;
    remove(this.#newPointComponent);
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #onFormSubmit = (state) => {
    this.destroy();
    this.#onPointChange(UserAction.ADD_POINT, UpdateType.MINOR, state);
  };

  #onCancel = () => {
    this.destroy();
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
}
