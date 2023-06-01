import AbstractView from '../framework/view/abstract-view';
import { UpdateType } from '../consts';

const createNewEventButtonTemplate = () => /* html */`
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>
`;

export default class NewEventButtonView extends AbstractView {
  #clickHandler;
  #pointsModel;

  constructor(clickHandler, pointsModel) {
    super();
    this.#clickHandler = clickHandler;
    this.#pointsModel = pointsModel;

    this.element.addEventListener('click', this.#handleCLick);
    this.#pointsModel.addObserver(this.#handleInit);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #handleCLick = (evt) => {
    evt.preventDefault();
    this.#clickHandler(evt);
  };

  #handleInit = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.element.disabled = false;
    }
  };
}
