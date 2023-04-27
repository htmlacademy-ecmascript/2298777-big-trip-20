import { render } from './render';
import FilterView from './view/filter-view';
import ListPresenter from './presenter/list-presenter';
import HeaderPresenter from './presenter/header-presenter';

const tripEvents = document.querySelector('.trip-events');
const tripMain = document.querySelector('.trip-main');

const listPresenter = new ListPresenter(tripEvents);
const headerPresenter = new HeaderPresenter(tripMain);

render(new FilterView(), document.querySelector('.trip-controls__filters'));
listPresenter.init();
headerPresenter.init();
