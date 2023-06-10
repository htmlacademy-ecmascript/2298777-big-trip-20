import { DateFormats } from '../consts';
import { humanizeDate } from '../util/utils';
import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';
import flatpickrOptions from '../util/flatpickr-options';
import he from 'he';
import { createPictureTemplate, createDatalistTemplate, createEventTypesTemplate, createEventOfferSelectors } from '../util/view-utils';

import 'flatpickr/dist/flatpickr.min.css';

const createEditPointTemplate = (point, destinations, allOffers, destination) => /*html*/`<li class="trip-events__item">
<form class="event event--edit" action="#" method="post">
  <header class="event__header">
    <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
        <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(point.type)}.png" alt="Event type icon">
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
      <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${he.encode(String(point.basePrice))}">
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${point.isDisabled ? 'disabled' : ''}>${point.isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${point.isDisabled ? 'disabled' : ''}>${point.isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button" ${point.isDisabled ? 'disabled' : ''}>
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
      <p class="event__destination-description">${he.encode(destination.description)}</p>
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

  get template() {
    return createEditPointTemplate(this._state, this.#destinations, this.#allOffers, this.#destination);
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.pointButtonClickHandler);
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#offerChangeHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);
    this.#initDatePickers();
  }

  removeElement() {
    super.removeElement();

    this.#removeDatePickers();
  }

  pointButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#allOffers = this.#getOffers(this.#point.type);
    this.updateElement(EditPointView.parsePointToState(this.#point));
    this.#onPointButtonClick();
  };

  #initDatePickers() {
    this.#startDatePicker = flatpickr(this.element.querySelector('#event-start-time-1'),
      {...flatpickrOptions, defaultDate: this._state.dateFrom, onChange: this.#dateFromChangeHandler, maxDate: this._state.dateTo});
    this.#endDatePicker = flatpickr(this.element.querySelector('#event-end-time-1'),
      {...flatpickrOptions, defaultDate: this._state.dateTo, onChange: this.#dateToChangeHandler, minDate: this._state.dateFrom});
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

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#onFormSubmit(EditPointView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#allOffers = this.#getOffers(evt.target.value);
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #destinationChangeHandler = (evt) => {
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

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: Number(evt.target.value),
    });
  };

  #offerChangeHandler = (evt) => {
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

  #dateFromChangeHandler = ([userDate]) => {
    this.#removeDatePickers();
    this._setState({
      dateFrom: userDate,
    });
    this.#initDatePickers();
  };

  #dateToChangeHandler = ([userDate]) => {
    this.#removeDatePickers();
    this._setState({
      dateTo: userDate,
    });
    this.#initDatePickers();
  };

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onDeleteClick(EditPointView.parseStateToPoint(this._state));
  };

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    delete state.isDisabled;
    delete state.isSaving;
    delete state.isDeleting;

    return {
      ...state,
    };
  }
}
