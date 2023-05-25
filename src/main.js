import ListPresenter from './presenter/list-presenter';
import HeaderPresenter from './presenter/header-presenter';
import PointsModel from './model/points-model';
import DestinationsModel from './model/destinations-model';
import OffersModel from './model/offers-model';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();
const destinationsModel = new DestinationsModel(pointsModel);
const offersModel = new OffersModel(pointsModel);

const listPresenter = new ListPresenter(tripEvents, pointsModel, destinationsModel, offersModel);
const headerPresenter = new HeaderPresenter(tripMain, filterContainer, pointsModel, destinationsModel);

headerPresenter.init();
listPresenter.init();
