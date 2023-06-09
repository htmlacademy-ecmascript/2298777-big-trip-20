import { humanizeDate, getTimeDiff } from '../util/utils';
import { DateFormats } from '../consts.js';
import AbstractView from '../framework/view/abstract-view';

const getOffersTemplate = (offers, activeOffers) => activeOffers.map((offer) => /*html*/
  `<li class="event__offer">
    <span class="event__offer-title">${offers.find((item) => item.id === offer).title}</span>
    +€&nbsp;
    <span class="event__offer-price">${offers.find((item) => item.id === offer).price}</span>
  </li>`).join('');


const createListElementTemplate = (point, destination, offers) => /*html*/`<li class="trip-events__item">
<div class="event">
  <time class="event__date" datetime="${humanizeDate(point.dateFrom, DateFormats.NORMAL)}">${humanizeDate(point.dateFrom, DateFormats.MONTH_WITH_DAY)}</time>
  <div class="event__type">
    <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
  </div>
  <h3 class="event__title">${point.type} ${destination.name}</h3>
  <div class="event__schedule">
    <p class="event__time">
      <time class="event__start-time" datetime="${humanizeDate(point.dateFrom, DateFormats.FULL_DATE)}">${humanizeDate(point.dateFrom, DateFormats.TIME)}</time>
      —
      <time class="event__end-time" datetime="${humanizeDate(point.dateTo, DateFormats.FULL_DATE)}">${humanizeDate(point.dateTo, DateFormats.TIME)}</time>
    </p>
    <p class="event__duration">${getTimeDiff(point.dateTo, point.dateFrom)}</p>
  </div>
  <p class="event__price">
    €&nbsp;<span class="event__price-value">${point.basePrice}</span>
  </p>
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${getOffersTemplate(offers, point.offers)}
  </ul>
  <button class="event__favorite-btn ${point.isFavorite ? 'event__favorite-btn--active' : ''}" type="button">
    <span class="visually-hidden">Add to favorite</span>
    <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
      <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
    </svg>
  </button>
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
</div>
</li>`;

export default class ListElementView extends AbstractView{
  #point;
  #destination;
  #offers;
  #onPointButtonClick;
  #onFavoriteButtonClick;
  #getTypeOffers;
  #allDestinations;

  constructor({point, onPointButtonClick, onFavoriteButtonClick, getTypeOffers, allDestinations}) {
    super();
    this.#point = point;
    this.#onPointButtonClick = onPointButtonClick;
    this.#onFavoriteButtonClick = onFavoriteButtonClick;
    this.#getTypeOffers = getTypeOffers;
    this.#allDestinations = allDestinations;
    this.#destination = this.#allDestinations.find((dest) => dest.id === this.#point.destination);
    this.#offers = this.#getTypeOffers(this.#point.type);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#pointButtonClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteButtonClickHandler);
  }

  get template() {
    return createListElementTemplate(this.#point, this.#destination, this.#offers);
  }

  #pointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onPointButtonClick();
  };

  #favoriteButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteButtonClick(this.#point);
  };
}
