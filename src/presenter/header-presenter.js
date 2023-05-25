import { render, RenderPosition } from '../framework/render';
import TripInfoView from '../view/trip-main-info-view';
import FilterView from '../view/filter-view';
import { filter } from '../util/filters';
import { humanizeDate } from '../util/utils';
import { DateFormats } from '../consts';

export default class HeaderPresenter {
  #headerContainer;
  #filterContainer;
  #pointModel;
  #destinationsModel;

  constructor(headerContainer, filterContainer, pointModel, destinationsModel) {
    this.#headerContainer = headerContainer;
    this.#filterContainer = filterContainer;
    this.#pointModel = pointModel;
    this.#destinationsModel = destinationsModel;
  }

  init() {
    render(new FilterView(this.#generateFilters()), this.#filterContainer);
    if (this.#pointModel.points.length !== 0) {
      render(new TripInfoView(this.#generateMainInfo()), this.#headerContainer, RenderPosition.AFTERBEGIN);
    }
  }

  #generateFilters() {
    return Object.entries(filter).map(([filterName, filterFunction]) => ({
      name: filterName,
      filter: filterFunction(this.#pointModel.points),
    }));
  }

  #generateMainInfo() {
    const createTitle = () => {
      const destinations = this.#destinationsModel.currentDestinations;

      const titleArray = [];
      destinations
        .map((item) => {
          if (!titleArray.includes(item.name) ||
            (titleArray.length !== 0 && item.name !== titleArray[titleArray.length - 1])) {
            titleArray.push(item.name);
          }
        });
      return titleArray.length > 3
        ? `${titleArray[0]} &mdash; ... &mdash; ${titleArray[titleArray.length - 1]}`
        : titleArray.join(' &mdash; ');
    };

    const createDateFromTo = () => {
      const points = this.#pointModel.points;
      const dateFrom = points[0].dateFrom;
      const dateTo = points[points.length - 1].dateTo;
      return `${humanizeDate(dateFrom, DateFormats.MONTH_WITH_DAY)} — ${humanizeDate(dateTo, DateFormats.MONTH_WITH_DAY)}`;
    };

    return {
      title: createTitle(),
      dateFromTo: createDateFromTo(),
      price: this.#pointModel.points.reduce((acc, point) => acc + point.basePrice, 0),
    };
  }
}
