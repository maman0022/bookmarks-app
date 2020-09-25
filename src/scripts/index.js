import 'normalize.css';
import '../styles/style.css';
import $ from 'jquery';
import render from './render';
import handlers from './handlers';

function main() {
  render.render();
  handlers.bindEventListeners();
}

$(main);