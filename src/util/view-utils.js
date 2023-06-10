import he from 'he';
import {Types} from '../consts.js';

const createPictureTemplate = (pictures) => pictures.map((picture) => /*html*/`<img class="event__photo" src="${he.encode(picture.src)}" alt="${he.encode(picture.description)}">`).join('');

const createDatalistTemplate = (destinations) => destinations.map((destination) => /*html*/`<option value="${he.encode(destination.name)}"></option>`).join('');

const createEventTypesTemplate = (type) =>
  Object.values(Types).map((value) => /*html*/`<div class="event__type-item">
    <input id="event-type-${value}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${value}" ${type === value ? 'checked=""' : ''}>
    <label class="event__type-label  event__type-label--${value}" for="event-type-${value}-1">${value.charAt(0).toUpperCase() + value.slice(1)}</label>
  </div>`).join('');

const createEventOfferSelectors = (offers, allOffers) => allOffers.map((offer) => {
  const title = he.encode(offer.title);
  return /*html*/`<div class="event__offer-selector">
  <input class="event__offer-checkbox  visually-hidden" id="event-offer-${title}-1" type="checkbox" name="event-offer-${title}"
  ${offers.some((item) => item === offer.id) ? 'checked=""' : ''} data-id="${he.encode(offer.id)}">
    <label class="event__offer-label" for="event-offer-${title}-1">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${he.encode(String(offer.price))}</span>
    </label>
  </div>`;
}).join('');

export {createPictureTemplate, createDatalistTemplate, createEventTypesTemplate, createEventOfferSelectors};
