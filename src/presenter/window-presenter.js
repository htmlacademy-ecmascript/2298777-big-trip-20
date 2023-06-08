import { render, RenderPosition, remove } from '../framework/render';
import ListView from '../view/list-view';
import SortView from '../view/sort-view';
import EmptyListView from '../view/list-empty-view';
import PointPresenter from './point-presenter';
import { humanizeDate } from '../util/utils';
import { SortTypes, UpdateType, UserAction } from '../consts';
import { DateFormats, FilterTypes } from '../consts';
import TripInfoView from '../view/trip-main-info-view';
import { filter } from '../util/filters';
import NewPointPresenter from './new-point-presenter';
import NewEventButtonView from '../view/new-event-button';
import LoadingListView from '../view/list-loading-view';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import sorts from '../util/sorts';

const TimeLimits = {
  MIN: 350,
  MAX: 1000,
};

export default class ListPresenter {
  #listContainer;
  #pointsModel;
  #destinationsModel;
  #offersModel;
  #listView = new ListView();
  #loadingListView = new LoadingListView();
  #offersWithTypes;
  #pointPresenters = new Map();
  #currentSortType = SortTypes.DAY;
  #allDestinations;
  #headerContainer;
  #sortComponent = null;
  #mainInfoComponent = null;
  #filterModel;
  #emptyListComponent = null;
  #newPointPresenter = null;
  #isLoading = true;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimits.MIN,
    upperLimit: TimeLimits.MAX,
  });

  constructor({ listContainer, pointsModel, destinationsModel, offersModel, headerContainer, filterModel }) {
    this.#listContainer = listContainer;
    this.#pointsModel = pointsModel;
    this.#destinationsModel = destinationsModel;
    this.#offersModel = offersModel;
    this.#headerContainer = headerContainer;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const filteredPoints = filter[this.#filterModel.filter](this.#pointsModel.points);

    return filteredPoints.sort(sorts[this.#currentSortType]);
  }

  init() {
    render(this.#listView, this.#listContainer);
    render(new NewEventButtonView(this.#onAddNewPointClick, this.#pointsModel), this.#headerContainer);
    render(this.#loadingListView, this.#listContainer);
  }

  renderWindow() {
    if (this.#isLoading) {
      render(this.#loadingListView, this.#listContainer);
      return;
    }

    if (this.points.length === 0 && this.#emptyListComponent === null) {
      this.#emptyListComponent = new EmptyListView(this.#filterModel.filter);
      render(this.#emptyListComponent, this.#listContainer);
      return;
    } else if (this.points.length === 0 && this.#emptyListComponent !== null) {
      return;
    }

    if (this.#mainInfoComponent === null) {
      this.#mainInfoComponent = new TripInfoView(this.#generateMainInfo());
      render(this.#mainInfoComponent, this.#headerContainer, RenderPosition.AFTERBEGIN);
    }

    if (this.#sortComponent === null) {
      this.#sortComponent = new SortView({
        sorts: Object.values(SortTypes),
        onSortChange: this.#onSortChange,
      });
      render(this.#sortComponent, this.#listContainer, RenderPosition.AFTERBEGIN);
    }

    this.renderPoints();
  }

  renderPoints() {
    for(let i = 0; i < this.points.length; i++) {
      const point = new PointPresenter({
        pointContainer: this.#listView,
        onPointChange: this.#handleViewAction,
        onModeChange: this.#onModeChange,
        allOffers: this.#offersWithTypes,
        allDestinations: this.#allDestinations,
      });
      point.init({
        point: this.points[i],
      });
      this.#pointPresenters.set(this.points[i].id, point);
    }
  }

  destroy({resetSortType = false, resetSortView = false, resetMainInfo = true} = {}) {
    if (this.#newPointPresenter) {
      this.#newPointPresenter.destroy();
    }

    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());

    if (this.#emptyListComponent !== null) {
      remove(this.#emptyListComponent);
      this.#emptyListComponent = null;
    }

    if (this.points.length === 0) {
      remove(this.#sortComponent);
      this.#sortComponent = null;
    }

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
        const typeOffers = this.#offersWithTypes.find((item) => item.type === point.type);
        if (typeOffers === undefined) {
          return;
        }
        typeOffers.offers.forEach((offer) => {
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

  #onModeChange = () => {
    if (this.#newPointPresenter !== null) {
      this.#newPointPresenter.destroy();
      this.#newPointPresenter = null;
    }
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.resetView());
  };

  #onSortChange = (sortType) => {
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
        this.#pointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.destroy();
        this.renderWindow();
        break;
      case UpdateType.MAJOR:
        this.destroy({resetSortType: true, resetSortView: true});
        this.renderWindow();
        break;
      case UpdateType.INIT:
        this.#offersWithTypes = [...this.#offersModel.allOffers];
        this.#allDestinations = [...this.#destinationsModel.allDestinations];
        this.#isLoading = false;
        remove(this.#loadingListView);
        this.renderWindow();
        break;
    }
  };

  #handleViewAction = async (actionType, updateType, update, needSaving = true) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        if (needSaving) {
          this.#pointPresenters.get(update.id).setSaving();
        }
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (e) {
          if (needSaving) {
            this.#pointPresenters.get(update.id).setAbortion();
          }
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (e) {
          this.#newPointPresenter.setAbortion();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (e) {
          this.#pointPresenters.get(update.id).setAbortion();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #onAddNewPointClick = (evt) => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    const addNewPointButton = evt.target;
    this.#newPointPresenter = new NewPointPresenter({
      listContainer: this.#listView,
      allDestinations: this.#allDestinations,
      allOffers: this.#offersWithTypes,
      onPointChange: this.#handleViewAction,
      addNewPointButton,
      onCancelClick: () => this.points.length === 0 ? render(this.#emptyListComponent, this.#listContainer) : remove(this.#emptyListComponent),
    });
    addNewPointButton.disabled = true;
    remove(this.#emptyListComponent);
    this.#newPointPresenter.init();
  };
}
