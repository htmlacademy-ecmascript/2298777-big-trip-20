import { render } from './render';
import FilterView from './view/filter-view';
import ListPresenter from './presenter/presenter';

const tripEvents = document.querySelector('.trip-events');

const listPresenter = new ListPresenter(tripEvents);

render(new FilterView(), document.querySelector('.trip-controls__filters'));
listPresenter.init();
