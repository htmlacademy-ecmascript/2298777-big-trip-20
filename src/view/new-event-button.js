import AbstractView from '../framework/view/abstract-view';
import { UpdateType } from '../consts';

const createNewEventButtonTemplate = () => /* html */`
  <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" disabled>New event</button>
`;

export default class NewEventButtonView extends AbstractView {
  #handleClick;
  #pointsModel;

  constructor(onClick, pointsModel) {
    super();
    this.#handleClick = onClick;
    this.#pointsModel = pointsModel;

    this.element.addEventListener('click', this.#clickHandler);
    this.#pointsModel.addObserver(this.#initHandler);
  }

  get template() {
    return createNewEventButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick(evt);
  };

  #initHandler = (updateType) => {
    if (updateType === UpdateType.INIT) {
      this.element.disabled = false;
    }
  };
}
