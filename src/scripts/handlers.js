import $ from 'jquery';
import render from './render';
import store from './store';
import api from './api';
import starFilled from '../images/star.svg';
import starUnfilled from '../images/star-unfilled.svg';

$.fn.extend({
  serializeJson: function () {
    const formData = new FormData(this[0]);
    const o = {};
    formData.forEach((val, name) => o[name] = val);
    return JSON.stringify(o);
  }
});

function handleAddNewBookmark() {
  $('main').on('click', '#add-bookmark', () => {
    store.adding = true;
    render.render();
  });
}

function handleDeleteBookmark() {
  $('main').on('click', '.bookmark-delete', e => {
    e.stopPropagation();
    const id = $(e.target).closest('.bookmark-id').data('id');
    store.deleteBookmark(id);
    api.deleteBookmark(id)
      .then(() => render.render());
  });
  //for accessibilty - does action on enter key press
  $('main').on('keypress', '.bookmark-delete', e => {
    if (e.which === 13) {
      e.stopPropagation();
      const id = $(e.target).closest('.bookmark-id').data('id');
      store.deleteBookmark(id);
      api.deleteBookmark(id)
        .then(() => render.render());
    }
  });
}

function handleCancelAddBookmark() {
  $('main').on('click', '#cancel-add-bookmark', () => {
    store.adding = false;
    render.render();
  });
}

function handleFilterBookmarksOpen() {
  $('main').on('click', '#filter-bookmarks', e => {
    store.filterListOpen = !store.filterListOpen;
    render.render();
    //if navigating by tab set focus to first button in list
    if (e.detail === 0) {
      setTimeout(() => { render.focus('#ratings-choices-container button'); }, 100);
    }
  });
}

function handleFilterBookmarksOverlay() {
  $('body').on('click', '#rating-select-overlay', () => {
    store.filterListOpen = false;
    render.render();
  });
}

function handleFilterBookmarksSelect() {
  $('main').on('click', '.ratings', e => {
    store.filter = Number($(e.target).data('rating'));
    store.filterListOpen = false;
    render.render();
  });
}

function handleExpandBookmark() {
  $('main').on('click', '.bookmark-id', e => {
    const id = $(e.target).closest('.bookmark-id').data('id');
    store.toggleExpanded(id);
    render.render();
  });
  //for accessibilty - does action on enter key press
  $('main').on('keypress', '.bookmark-id', e => {
    if (e.which === 13) {
      const id = $(e.target).closest('.bookmark-id').data('id');
      store.toggleExpanded(id);
      render.render();
      //set focus after render so can continue at same location 
      setTimeout(() => { render.focus(`[data-id="${id}"]`); }, 100);
    }
  });
}

function handleEditBookmarkDescription() {
  $('main').on('click', '.desc-element', e => {
    const id = $(e.target).closest('li').find('.bookmark-id').data('id');
    store.editingDescription = { target: e.target, id };
    render.render();
  });
  //for accessibilty - does action on enter key press
  $('main').on('keypress', '.desc-element', e => {
    if (e.which === 13) {
      const id = $(e.target).closest('li').find('.bookmark-id').data('id');
      store.editingDescription = { target: e.target, id };
      render.render();
    }
  });
}

function handleUpdateBookmarkDescription() {
  $('main').on('submit', '.update-desc-form', e => {
    e.preventDefault();
    let data = $(e.target).serializeJson();
    const id = $(e.target).closest('li').find('.bookmark-id').data('id');
    api.updateBookmark(data, id)
      .then(() => render.render());
  });
}

function handleRatingMouseEnterEffect() {
  $('main').on('mouseover', '.unrated-buttons', e => {
    let rating = Number($(e.target).data('rating'));
    for (let index = 1; index <= rating; ++index) {
      $(`#unrated-button-${index}`).css('background-image', `url(${starFilled})`);
    }
  });
}

function handleRatingMouseLeaveEffect() {
  $('main').on('mouseleave', '.unrated-buttons', () => {
    $('.unrated-buttons').css('background-image', `url(${starUnfilled})`);
  });
}

function handleRatingClickEffect() {
  $('main').on('click', '.unrated-buttons', e => {
    e.preventDefault();
    $('main').off('mouseleave mouseover', '.unrated-buttons');
    let rating = Number($(e.target).data('rating'));
    for (let index = 1; index <= rating; ++index) {
      $(`#unrated-button-${index}`).css('background-image', `url(${starFilled})`);
    }
    for (let index = 5; index > rating; --index) {
      $(`#unrated-button-${index}`).css('background-image', `url(${starUnfilled})`);
    }
    $('#rating-input').val(rating);
  });
}

function handleAddBookmarkFormSubmit() {
  $('main').on('submit', '#add-bookmark-form', e => {
    e.preventDefault();
    store.adding = false;
    $('#rating-input').val() === '' ? $('#rating-input').remove() : void 0;
    let data = $('form').serializeJson();
    api.addBookmark(data)
      .then(() => {
        render.render();
      })
      .catch(error => {
        store.error = error;
        store.adding = true;
        render.render();
      });
  });
}

function bindEventListeners() {
  handleAddNewBookmark();
  handleDeleteBookmark();
  handleFilterBookmarksOpen();
  handleFilterBookmarksOverlay();
  handleFilterBookmarksSelect();
  handleCancelAddBookmark();
  handleExpandBookmark();
  handleEditBookmarkDescription();
  handleUpdateBookmarkDescription();
  handleRatingMouseEnterEffect();
  handleRatingMouseLeaveEffect();
  handleRatingClickEffect();
  handleAddBookmarkFormSubmit();
}

export default {
  bindEventListeners
};