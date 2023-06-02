import ListPresenter from './presenter/window-presenter';
import PointsModel from './model/points-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter';
import PointApiService from './api/point-api-service';
import DestinationApiService from './api/destination-api-service';
import OffersApiService from './api/offers-api-service';

const END_POINT = 'https://20.objects.pages.academy/big-trip';
const AUTH = 'Basic B78gGfED2g';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel({
  pointsAPiService: new PointApiService(END_POINT, AUTH),
  destinationsAPiService: new DestinationApiService(END_POINT, AUTH),
  offersAPiService: new OffersApiService(END_POINT, AUTH),
});
const destinationsModel = new DestinationsModel({
  pointsModel,
});
const offersModel = new OffersModel({
  pointsModel,
});
const filterModel = new FilterModel();

const listPresenter = new ListPresenter({
  listContainer: tripEvents,
  pointsModel,
  destinationsModel,
  offersModel,
  headerContainer: tripMain,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel,
});

pointsModel.init();
filterPresenter.init();
listPresenter.init();
