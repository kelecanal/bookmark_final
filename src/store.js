let bookmarks = [];
let adding = false;
let error = null;
let filter = false;
let filteredBookmarks = [];

const addBookmark = function (obj) {
  //create for loop
  for (let i = 0; i < bookmarks.length; i++) {
    if (bookmarks[i]) {
      bookmarks[i].expand = false;
    }
  }
  //add bmmark to store
  bookmarks.push(obj);
  this.adding = false;
};

const expandBookmark = function (id) {
  let expandedBookmark = bookmarks.find((bookmark) => bookmark.id === id);
  if (expandedBookmark.expand) {
    expandedBookmark.expand = false;
  } else {
    expandedBookmark.expand = true;
  }
};

const deleteBookmark = function (obj) {
  this.bookmarks = this.bookmarks.filter((bookmark) => bookmark.id !== obj);
};

const filterBookmarks = function (strValue) {
  this.filter = true;
  this.bookmarks.forEach((bookmark) => {
    if (bookmark.rating >= strValue) {
      this.filteredBookmarks.push(bookmark);
    }
  });
};

//set

const setAdding = function (inp) {
  this.adding = inp;
};

const setFilter = function (inp) {
  this.filter = inp;
};

export default {
  bookmarks,
  adding,
  error,
  filter,
  filteredBookmarks,
  addBookmark,
  expandBookmark,
  deleteBookmark,
  filterBookmarks,
  setAdding,
  setFilter,
};
