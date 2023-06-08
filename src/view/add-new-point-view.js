import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import EditPointView from './edit-point-view.js';
import { Types } from '../consts.js';
import { humanizeDate } from '../util/utils.js';
import { DateFormats } from '../consts.js';
import flatpickrOptions from '../util/flatpickr-options.js';
import flatpickr from 'flatpickr';
import he from 'he';

import 'flatpickr/dist/flatpickr.min.css';

const emptyPoint = (exactTime) => ({
  destination: '',
  type: Types.TAXI,
  dateFrom: exactTime,
  dateTo: new Date(new Date(exactTime).setDate(exactTime.getDate() + 1)),
  basePrice: 1,
  offers: [],
  isFavorite: false,
});

const emptyDestination = {
  name: '',
  description: '',
  pictures: [],
  id: '',
};

const createPictureTemplate = (pictures) => pictures.map((picture) => /*html*/`<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('');

const createEventOfferSelectors = (offers, allOffers) => allOffers.map((offer) => /*html*/`<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title}-1" type="checkbox" name="event-offer-${offer.title}"
  ${offers.some((item) => item === offer.id) ? 'checked=""' : ''} data-id="${offer.id}">
  <label class="event__offer-label" for="event-offer-${offer.title}-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </label>
</div>`).join('');

const createDatalistTemplate = (destinations) => destinations.map((destination) => /*html*/`<option value="${destination.name}"></option>`).join('');

const createEventTypesTemplate = (type) =>
  Object.values(Types).map((value) => /*html*/`<div class="event__type-item">
    <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}" ${type === value ? 'checked=""' : ''}>
    <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value}</label>
  </div>`).join('');

const createAddNewPointTemplate = (point, destinations, destination, offers) => /*html*/`<li class="trip-events__item">
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
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-1">
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
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${point.basePrice}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${point.isDisabled || destination.name === '' ? 'disabled' : ''}>${point.isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${point.isDisabled ? 'disabled' : ''}>Cancel</button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers ${offers.length === 0 ? 'visually-hidden' : ''}">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${createEventOfferSelectors(point.offers, offers)}
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

export default class AddNewPointView extends AbstractStatefulView {
  #point;
  #destinations;
  #destination;
  #offers;
  #onFormSubmit;
  #onFormReset;
  #getOffers;
  #startDatePicker;
  #endDatePicker;

  constructor({destinations, getOffers, onFormSubmit, onCancelClick}) {
    super();
    this.#destinations = destinations;
    this.#onFormSubmit = onFormSubmit;
    this.#onFormReset = onCancelClick;
    const exactTime = new Date();
    this.#point = emptyPoint(exactTime);
    this.#destination = emptyDestination;
    this.#getOffers = getOffers;
    this.#offers = getOffers(this.#point.type);
    this._setState(EditPointView.parsePointToState(this.#point));
    this._restoreHandlers();
  }

  get template() {
    return createAddNewPointTemplate(this._state, this.#destinations, this.#destination, this.#offers);
  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#handleFormSubmit);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#handleFormReset);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#handleTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#handleDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#handlePriceChange);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#handleOfferChange);
    this.#initDatePickers();
  }

  removeElement() {
    super.removeElement();

    this.#removeDatePickers();
  }

  #initDatePickers() {
    this.#startDatePicker = flatpickr(this.element.querySelector('#event-start-time-1'),
      {...flatpickrOptions, defaultDate: this._state.dateFrom, onChange: this.#handleDateFromChange, maxDate: this._state.dateTo});
    this.#endDatePicker = flatpickr(this.element.querySelector('#event-end-time-1'),
      {...flatpickrOptions, defaultDate: this._state.dateTo, onChange: this.#handleDateToChange, minDate: this._state.dateFrom});
  }

  #removeDatePickers() {
    if (this.#startDatePicker) {
      this.#startDatePicker.destroy();
      this.#startDatePicker = null;
    }

    if (this.#endDatePicker) {
      this.#endDatePicker.destroy();
      this.#endDatePicker = null;
    }
  }

  #handleFormSubmit = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #handleFormReset = (evt) => {
    evt.preventDefault();
    this.#onFormReset();
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
      if (newDestination !== '') {
        this.#destination = this.#destinations.find((destination) => destination.id === newDestination);
      }
      this.updateElement({
        destination: newDestination,
      });
    }
  };

  #handleTypeChange = (evt) => {
    evt.preventDefault();
    this.#offers = this.#getOffers(evt.target.value);
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
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
    const offers = this._state.offers;
    const offerId = evt.target.dataset.id;
    if (evt.target.checked) {
      newOffers.push(offerId);
    } else {
      const index = offers.findIndex((offer) => offer === offerId);
      newOffers.splice(index, 1);
    }
    this._setState({
      offers: newOffers,
    });
  };

  #handleDateFromChange = ([userDate]) => {
    this.#removeDatePickers();
    this._setState({
      dateFrom: userDate,
    });
    this.#initDatePickers();
  };

  #handleDateToChange = ([userDate]) => {
    this.#removeDatePickers();
    this._setState({
      dateTo: userDate,
    });
    this.#initDatePickers();
  };

}
