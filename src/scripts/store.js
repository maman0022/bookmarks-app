import store from './store';
import api from './api';

let bookmarks = [];
let adding = false;
let error = null;
let filter = 0;
let filterListOpen = false;
let editingDescription = false;

function updateLocalStore() {
  return api.getBookmarks()
    .then(bookmarks => {
      bookmarks.forEach(bookmark => {
        let matchingElement = findById(bookmark.id);
        if (matchingElement) {
          Object.assign(matchingElement, bookmark);
        }
        else {
          bookmark.expanded = false;
          store.addBookmark(bookmark);
        }
      });
      return Promise.resolve();
    });
}

function addBookmark(bookmark) {
  this.bookmarks.push(bookmark);
}

function findById(id) {
  return bookmarks.find(bookmark => bookmark.id === id);
}

function findIndexById(id) {
  return bookmarks.findIndex(bookmark => bookmark.id === id);
}

function toggleExpanded(id) {
  let bookmark = findById(id);
  bookmark.expanded = !bookmark.expanded;
}

function deleteBookmark(id) {
  const index = findIndexById(id);
  bookmarks.splice(index, 1);
}

export default {
  bookmarks,
  adding,
  error,
  filter,
  filterListOpen,
  editingDescription,
  addBookmark,
  deleteBookmark,
  updateLocalStore,
  toggleExpanded
};