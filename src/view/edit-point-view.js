import { Types, DateFormats } from '../consts';
import { humanizeDate } from '../util/utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import flatpickrOptions from '../flatpickr-options';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const createPictureTemplate = (pictures) => pictures.map((picture) => /*html*/`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const createDatalistTemplate = (destinations) => destinations.map((destination) => /*html*/`<option value="${destination.name}"></option>`).join('');

const createEventTypesTemplate = (type) =>
  Object.values(Types).map((value) => /*html*/`<div class="event__type-item">
    <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}" ${type === value ? 'checked=""' : ''}>
    <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value}</label>
  </div>`).join('');

const createEventOfferSelectors = (offers, allOffers) => allOffers.map((offer) => /*html*/`<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}"
  ${offers.some((item) => item === offer.id) ? 'checked=""' : ''} data-id="${offer.id}">
  <label class="event__offer-label" for="event-offer-${offer.title}-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`).join('');

const createEditPointTemplate = (point, destinations, allOffers, destination) => /*html*/`<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>

          ${createEventTypesTemplate(point.type)}
        </fieldset>
      </div>
    </div>

    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
        ${point.type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
      <datalist id="destination-list-1">
        ${createDatalistTemplate(destinations)}
      </datalist>
    </div>

    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(point.dateFrom, DateFormats.SLASH_FULL_DATE)}">
      —
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(point.dateTo, DateFormats.SLASH_FULL_DATE)}">
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        €
      </label>
      <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
    <button class="event__reset-btn" type="reset">Delete</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers ${allOffers.length === 0 ? 'visually-hidden' : ''}">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createEventOfferSelectors(point.offers, allOffers)}
      </div>
    </section>

    <section class="event__section  event__section--destination ${destination.description === '' ? 'visually-hidden' : ''}">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>
      <div class="event__photos-container">
        <div class="event__photos-tape">
          ${createPictureTemplate(destination.pictures)}
        </div>
      </div>
    </section>
  </section>
</form>
</li>`;

export default class EditPointView extends AbstractStatefulView {
  #onPointButtonClick;
  #onFormSubmit;
  #getOffers;
  #point;
  #destinations;
  #allOffers;
  #destination;
  #startDatePicker;
  #endDatePicker;
  #onDeleteClick;

  constructor({point, onPointButtonClick, onFormSubmit, getOffers, destinations, onDeleteClick}) {
    super();
    this.#point = point;
    this.#allOffers = getOffers(point.type);
    this.#destinations = destinations;
    this.#destination = destinations.find((destination) => destination.id === point.destination);
    this._setState(EditPointView.parsePointToState(point));
    this.#onPointButtonClick = onPointButtonClick;
    this.#onFormSubmit = onFormSubmit;
    this.#getOffers = getOffers;
    this.#onDeleteClick = onDeleteClick;
    this._restoreHandlers();
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#handlePointButtonClick);
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#handleTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#handleDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#handlePriceChange);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#handleOfferChange);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleDeleteClick);
    this.#startDatePicker = flatpickr(this.element.querySelector('#event-start-time-1'),
      {...flatpickrOptions, defaultDate: this._state.dateFrom, onChange: this.#handleDateFromChange, maxDate: this._state.dateTo});
    this.#endDatePicker = flatpickr(this.element.querySelector('#event-end-time-1'),
      {...flatpickrOptions, defaultDate: this._state.dateTo, onChange: this.#handleDateToChange, minDate: this._state.dateFrom});
  }

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#allOffers, this.#destination);
  }

  #handlePointButtonClick = (evt) => {
    evt.preventDefault();
    this.#allOffers = this.#getOffers(this.#point.type);
    this.updateElement(EditPointView.parsePointToState(this.#point));
    this.#onPointButtonClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #handleTypeChange = (evt) => {
    evt.preventDefault();
    this.#allOffers = this.#getOffers(evt.target.value);
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #handleDestinationChange = (evt) => {
    evt.preventDefault();
    let newDestination;
    try {
      newDestination = this.#destinations.find((destination) =>
        destination.name === evt.target.value).id;
    } catch (err) {
      newDestination = this._state.destination;
    } finally {
      this.#destination = this.#destinations.find((destination) => destination.id === newDestination);
      this.updateElement({
        destination: newDestination,
      });
    }
  };

  #handlePriceChange = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #handleOfferChange = (evt) => {
    evt.preventDefault();
    const newOffers = [...this._state.offers];
    if (evt.target.checked) {
      const offer = this.#allOffers.find((item) => String(item.id) === evt.target.dataset.id);
      newOffers.push(offer.id);
    } else {
      newOffers.splice(newOffers.findIndex((offer) => String(offer.id) === evt.target.dataset.id), 1);
    }
    this._setState({
      offers: newOffers,
    });
  };


  static parsePointToState(point) {
    return {
      ...point,
    };
  }

  static parseStateToPoint(state) {
    return {
      ...state,
    };
  }

  #handleDateFromChange = ([userDate]) => {
    this._setState({
      dateFrom: userDate,
    });
  };

  #handleDateToChange = ([userDate]) => {
    this._setState({
      dateTo: userDate,
    });
  };

  removeElement() {
    super.removeElement();

    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  }

  #handleDeleteClick = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditPointView.parseStateToPoint(this._state));
  };
}
