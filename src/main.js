import ListPresenter from './presenter/list-presenter';
import HeaderPresenter from './presenter/header-presenter';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');
const filterContainer = document.querySelector('.trip-controls__filters');

const listPresenter = new ListPresenter(tripEvents);
const headerPresenter = new HeaderPresenter(tripMain, filterContainer);

headerPresenter.init();
listPresenter.init();
