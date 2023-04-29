import ListPresenter from './presenter/list-presenter';
import HeaderPresenter from './presenter/header-presenter';
import PointsModel from './model/points-model';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel();

const listPresenter = new ListPresenter(tripEvents, pointsModel);
const headerPresenter = new HeaderPresenter(tripMain, filterContainer);

headerPresenter.init();
listPresenter.init();
