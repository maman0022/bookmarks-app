const BASE_URL = 'https://thinkful-list-api.herokuapp.com/Muhammad/bookmarks/';
const HEADERS = new Headers({ 'Content-Type': 'application/json' });

function fetchWrapper(url, options = {}) {
  let error;
  return fetch(url, options)
    .then(resp => {
      if (!resp.ok) {
        error = resp.statusText;
      }
      return resp.json();
    })
    .then(data => {
      if (error) {
        return Promise.reject(data.message);
      }
      return data;
    });
}

function getBookmarks() {
  return fetchWrapper(BASE_URL);
}

function deleteBookmark(id) {
  return fetchWrapper(BASE_URL + id, { method: 'DELETE', headers: HEADERS });
}

function addBookmark(data) {
  return fetchWrapper(BASE_URL, { method: 'POST', headers: HEADERS, body: data });
}

function updateBookmark(data, id) {
  return fetchWrapper(BASE_URL + id, { method: 'PATCH', headers: HEADERS, body: data });
}

export default {
  getBookmarks,
  deleteBookmark,
  addBookmark,
  updateBookmark
};