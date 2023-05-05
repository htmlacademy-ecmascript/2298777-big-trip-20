import AbstractView from '../framework/view/abstract-view';

const createTripInfoTemplate = (mainInfo) => `<section class="trip-main__trip-info  trip-info">
<div class="trip-info__main">
  <h1 class="trip-info__title">${mainInfo.title}</h1>

  <p class="trip-info__dates">${mainInfo.dateFromTo}</p>
</div>

<p class="trip-info__cost">
  Total: €&nbsp;<span class="trip-info__cost-value">${mainInfo.price}</span>
</p>
</section>`;

export default class TripInfoView extends AbstractView{
  #mainInfo;

  constructor(mainInfo) {
    super();
    this.#mainInfo = mainInfo;
  }

  get template() {
    return createTripInfoTemplate(this.#mainInfo);
  }
}
