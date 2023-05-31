import AbstractView from '../framework/view/abstract-view.js';
import { FilterTypes } from '../consts.js';

const filterMessages = {
  [FilterTypes.EVERYTHING]: 'Click New Event to create your first point',
  [FilterTypes.FUTURE]: 'There are no future events now',
  [FilterTypes.PAST]: 'There are no past events now',
  [FilterTypes.PRESENT]: 'There are no present events now',
};

const createEmptyTemplate = (filterType) => /*html*/`<p class="trip-events__msg">${filterMessages[filterType]}</p>`;

export default class EmptyListView extends AbstractView{
  #filterType;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createEmptyTemplate(this.#filterType);
  }
}
