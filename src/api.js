const BASE_URL = "https://thinkful-list-api.herokuapp.com/kelecanal";

//retrieve list from API
function listApiFetch(...args) {
  let err;
  return fetch(...args)
    .then((res) => {
      if (!res.ok) {
        err = {
          code: res.status,
        };
      }
      return res.json();
    })
    .then((data) => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
}

//get total bookmarks
const retrieveBookmark = function () {
  return fetch(`${BASE_URL}/bookmarks`);
};

//create new bookmark
const saveBookmark = function (obj) {
  const newBookmark = obj;
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: newBookmark,
  };

  return listApiFetch(BASE_URL + "/bookmarks", options);
};

//delete bookmark
const deleteBookmark = function (obj) {
  const options = {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  };
  return listApiFetch(BASE_URL + "/bookmarks/" + obj, options);
};

//export functions
export default {
  retrieveBookmark,
  saveBookmark,
  deleteBookmark,
};
