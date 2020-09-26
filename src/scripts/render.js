import store from './store';
import $ from 'jquery';
import starFilled from '../images/star.svg';
import starUnfilled from '../images/star-unfilled.svg';

function generateAddBookmarkSection() {
  return `
  <section class="flex-column align-center full-width">
      <form class="flex-column align-start full-width" id="add-bookmark-form">
        <h3 class="self-center">Add New Bookmark</h3>
        <label for="add-bookmark-url">Enter Url:</label>
        <input type="text" class="full-width" id="add-bookmark-url" name="url" required>
        ${store.error ? generateErrorMessage(store.error) : ''}
        <label for="add-bookmark-title">Enter Title:</label>
        <input type="text" class="full-width" id="add-bookmark-title" name="title" required>
        <label>Choose a Rating: (Optional)</label>
        <div id="unrated-container">
          <button id="unrated-button-1" class="unrated-buttons" data-rating="1"><span class="hidden">1 star</span></button>
          <button id="unrated-button-2" class="unrated-buttons" data-rating="2"><span class="hidden">2 star</span></button>
          <button id="unrated-button-3" class="unrated-buttons" data-rating="3"><span class="hidden">3 star</span></button>
          <button id="unrated-button-4" class="unrated-buttons" data-rating="4"><span class="hidden">4 star</span></button>
          <button id="unrated-button-5" class="unrated-buttons" data-rating="5"><span class="hidden">5 star</span></button>
          <input type="hidden" name="rating" id="rating-input">
        </div>
        <label for="bookmark-textarea">Add a description: (Optional)</label>
        <textarea name="desc" id="bookmark-textarea" rows="5"></textarea>
        <div class="flex-row justify-around" id="form-buttons">
          <input type="reset" class="general-btn" value="Cancel" id="cancel-add-bookmark">
          <input type="submit" class="general-btn" value="Create">
        </div>
      </form>
    </section>
  `;
}

function generateRatingStars(n) {
  let output = '';
  for (let index = 0; index < n; index++) {
    output += `
    <div>&#11088;</div>
    `;
  }
  return output;
}

function generateBookmarks(bookmarks = store.bookmarks) {
  let list = '';
  bookmarks.forEach(bookmark => {
    if (bookmark.expanded) {
      list += `
      <li class="bookmark flex-column align-center justify-start">
          <div class="flex-row justify-between align-center full-width bookmark-id" tabindex="0" data-id=${bookmark.id}>
            <h3 class="bookmark-title">${bookmark.title}</h3>
            <button class="bookmark-delete"><span class="hidden">delete bookmark</span></button>
          </div>
          <div class="flex-column align-center full-width">
            <div class="flex-row justify-evenly full-width">
              <a href="${bookmark.url}" target="_blank">Visit Site</a>
            ${bookmark.rating ? '<div class="flex-row align-center">' + generateRatingStars(bookmark.rating) + '</div>' : ''}
            </div>
              <p class="flex-row justify-center full-width desc-element" tabindex="0">${bookmark.desc ? bookmark.desc : ''}</p>
              <form class="align-center full-width update-desc-form">
                <label for="edit-bk-desc-${bookmark.id}">Edit Bookmark Description:</label>
                <textarea class="full-width" name="desc" id="edit-bk-desc-${bookmark.id}" rows="5">${bookmark.desc ? bookmark.desc : ''}</textarea>
                <input type="submit" class="general-btn update-desc-btn" value="Update">
              </form>
          </div>
        </li>
      `;
    }
    else {
      list += `
    <li class="bookmark flex-row align-center justify-between bookmark-id outer-title" tabindex="0" data-id=${bookmark.id}>
          <h3 class="bookmark-title">${bookmark.title}</h3>
          <div class="flex-row align-center">
            ${bookmark.rating ? generateRatingStars(bookmark.rating) : ''}
          </div>
        </li>
    `;
    }
  });
  return `<ul class="full-width">${list}</ul>`;
}

function generateAddAndFilterButtons() {
  return `
  <div class="flex-row justify-evenly align-center full-width">
    <button id="add-bookmark" class="general-btn">Add Bookmark</button>
    <div>
    <button id="filter-bookmarks" class="general-btn">Filter By <span>&#9660;</span></button>
    <div id="ratings-choices-container">
        <button class="ratings" data-rating="5">⭐⭐⭐⭐⭐</button>
        <button class="ratings" data-rating="4">⭐⭐⭐⭐</button>
        <button class="ratings" data-rating="3">⭐⭐⭐</button>
        <button class="ratings" data-rating="2">⭐⭐</button>
        <button class="ratings" data-rating="1">⭐</button>
        <button class="ratings" data-rating="0">No Filter</button>
      </div>
      </div>
  </div>
  `;
}

function generateViewBookmarkSection(bookmarks) {
  return `<section>${generateAddAndFilterButtons() + generateBookmarks(bookmarks)}</section>`;
}

function generateErrorMessage(error) {
  store.error = null;
  return `
  <div id="error-container">
    <div id="arrow-div"></div>
    <div id="error-message">
      <p>${error}</p>
    </div>
  </div>
  `;
}

function renderFilterSelectionOptions() {
  if (store.filterListOpen) {
    $('#ratings-choices-container').css('display', 'flex');
    //create overlay so user can click anywhere to close filter dropdown
    $('body').prepend('<div id="rating-select-overlay"></div>');
  }
  else {
    $('#rating-select-overlay').remove();
  }
}

function renderDescriptionEditor() {
  let target = store.editingDescription.target;
  let id = store.editingDescription.id;
  store.editingDescription = false;
  let form = $(`[data-id=${id}]`).closest('li').find('.update-desc-form');
  $(target).hide();
  form.css('display', 'flex');
  form.css('flex-direction', 'column');
  //place cursor at end of line
  let temp = form.find('textarea').focus().val();
  form.find('textarea').val('').val(temp);
}

function renderFocus(selector) {
  $(selector)[0].focus();
}

function renderRatingMouseEnterEffect(rating) {
  for (let index = 1; index <= rating; ++index) {
    $(`#unrated-button-${index}`).css('background-image', `url(${starFilled})`);
  }
}

function renderRatingMouseLeaveEffect() {
  $('.unrated-buttons').css('background-image', `url(${starUnfilled})`);
}

function renderRatingClickEffect(rating) {
  for (let index = 1; index <= rating; ++index) {
    $(`#unrated-button-${index}`).css('background-image', `url(${starFilled})`);
  }
  for (let index = 5; index > rating; --index) {
    $(`#unrated-button-${index}`).css('background-image', `url(${starUnfilled})`);
  }
  $('#rating-input').val(rating);
}

function render() {
  if (store.adding) {
    $('main').html(generateAddBookmarkSection());
  }
  else if (store.filter) {
    let bookmarks = store.bookmarks.filter(bookmark => bookmark.rating >= store.filter);
    $('main').html(generateViewBookmarkSection(bookmarks));
    renderFilterSelectionOptions();
  }
  else if (store.editingDescription) {
    renderDescriptionEditor();
  }
  else {
    store.updateLocalStore()
      .then(() => {
        $('main').html(generateViewBookmarkSection());
        renderFilterSelectionOptions();
      });
  }

}

export default {
  render,
  renderFocus,
  renderRatingMouseEnterEffect,
  renderRatingMouseLeaveEffect,
  renderRatingClickEffect
};