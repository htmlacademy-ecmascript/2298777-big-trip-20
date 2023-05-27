import { render, RenderPosition, remove } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import { getDiffInSeconds, humanizeDate } from '../util/utils';
import { SortTypes, UpdateType, UserAction } from '../consts';
import { DateFormats, FilterTypes } from '../consts';
import TripInfoView from '../view/trip-main-info-view';
import { filter } from '../util/filters';
import NewPointPresenter from './new-point-presenter';

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #destinationsModel;
  #offersModel;
  #listView = new ListView();
  #offersWithTypes;
  #pointPresenters = new Map();
  #currentSortType = SortTypes.DAY;
  #allDestinations;
  #headerContainer;
  #sortComponent = null;
  #mainInfoComponent = null;
  #filterModel;

  constructor({ listContainer, pointsModel, destinationsModel, offersModel, headerContainer, filterModel }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#headerContainer = headerContainer;
    this.#filterModel = filterModel;
    this.#offersWithTypes = [...offersModel.allOffers];
    this.#allDestinations = [...destinationsModel.allDestinations];
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filteredPoints = filter[this.#filterModel.filter](this.#pointsModel.points);

    return this.#sortPoints({ sortType: this.#currentSortType, returnType: 'points', points: filteredPoints });
  }

  init() {
    render(this.#listView, this.#listContainer);
    document.querySelector('.trip-main__event-add-btn').addEventListener('click', this.#handleAddNewPointClick);
    this.renderWindow();
  }

  renderWindow() {
    if (this.points.length === 0) {
      render(new EmptyListView(), this.#listContainer);
      return;
    }

    if (this.#mainInfoComponent === null) {
      this.#mainInfoComponent = new TripInfoView(this.#generateMainInfo());
      render(this.#mainInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    }

    if (this.#sortComponent === null) {
      this.#sortComponent = new SortView({
        sorts: Object.values(SortTypes),
        onSortChange: this.#handleSortChange,
      });
      render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
    }

    this.renderPoints();
  }

  #generateMainInfo() {
    const createTitle = () => {
      const destinations = this.points.map((point) =>
        this.#allDestinations.find((item) => item.id === point.destination)
      );

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
      const points = this.points;
      const dateFrom = points[0].dateFrom;
      const dateTo = points[points.length - 1].dateTo;
      return `${humanizeDate(dateFrom, DateFormats.MONTH_WITH_DAY)} — ${humanizeDate(dateTo, DateFormats.MONTH_WITH_DAY)}`;
    };

    const getPrice = () => {
      let basePrice = this.points.reduce((sum, point) => sum + point.basePrice, 0);
      this.points.forEach((point) => {
        const offers = this.#offersWithTypes.find((item) => item.type === point.type).offers;
        offers.forEach((offer) => {
          basePrice += point.offers.some((item) => item === offer.id) ? offer.price : 0;
        });
      });
      return basePrice;
    };

    return {
      title: createTitle(),
      dateFromTo: createDateFromTo(),
      price: getPrice(),
    };
  }

  renderPoints() {
    for(let i = 0; i < this.points.length; i++) {
      const point = new PointPresenter({
        pointContainer: this.#listView,
        onPointChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
        allOffers: this.#offersWithTypes,
        allDestinations: this.#allDestinations,
      });
      point.init({
        point: this.points[i],
      });
      this.#pointPresenters.set(this.points[i].uniqueId, point);
    }
  }

  destroy({resetSortType = false, resetSortView = false, resetMainInfo = true} = {}) {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#pointPresenters.clear();

    if (resetMainInfo) {
      remove(this.#mainInfoComponent);
      this.#mainInfoComponent = null;
    }

    if (resetSortType) {
      this.#currentSortType = SortTypes.DAY;
    }

    if (resetSortView) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #sortPoints = ({sortType, returnType, points = this.#pointsModel.points}) => {
    const sortable = [...points].map(
      (value, index) => [points[index], this.#destinationsModel.currentDestinations[index], this.#offersModel.activeOffers[index]]
    );
    switch (sortType) {
      case SortTypes.TIME:
        sortable.sort((a, b) => getDiffInSeconds(b[0].dateTo, b[0].dateFrom) - getDiffInSeconds(a[0].dateTo, a[0].dateFrom));
        break;
      case SortTypes.PRICE:
        sortable.sort((a, b) => b[0].basePrice - a[0].basePrice);
        break;
    }
    if (returnType === 'points') {
      return sortable.map((value) => value[0]);
    } else if (returnType === 'destinations') {
      return sortable.map((value) => value[1]);
    } else if (returnType === 'offers') {
      return sortable.map((value) => value[2]);
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.destroy({resetMainInfo: false});
    this.renderWindow();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.uniqueId).init(data);
        break;
      case UpdateType.MINOR:
        this.destroy();
        this.renderWindow();
        break;
      case UpdateType.MAJOR:
        this.destroy({resetSortType: true, resetSortView: true});
        this.renderWindow();
        break;
    }
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleAddNewPointClick = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    const addNewPointButton = document.querySelector('.trip-main__event-add-btn');
    const newPointPresenter = new NewPointPresenter({
      listContainer: this.#listView,
      allDestinations: this.#allDestinations,
      allOffers: this.#offersWithTypes,
      onPointChange: this.#handleViewAction,
      addNewPointButton,
    });
    addNewPointButton.disabled = true;
    newPointPresenter.init();
  };
}
