import AbstractView from '../framework/view/abstract-view';

const createNewEventButtonTemplate = () => /* html */`
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>
`;

export default class NewEventButtonView extends AbstractView {
  #clickHandler;

  constructor(clickHandler) {
    super();
    this.#clickHandler = clickHandler;

    this.element.addEventListener('click', this.#handleCLick);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #handleCLick = (evt) => {
    evt.preventDefault();
    this.#clickHandler(evt);
  };
}
