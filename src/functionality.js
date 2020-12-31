import $ from "jquery";
import api from "./api";
import STORE from "./store";

const ratingStar = function (bookmark) {
  let starRatings;
  let starUp = bookmark.rating;
  let starSelect = 5 - starUp;
  const starUpHtml = `<span class="star-up checked"></span>`;
  const starSelectHtml = `<span class="star-up"></span>`;

  starRatings = starUpHtml.repeat(starUp) + starSelectHtml.repeat(starSelect);

  return starRatings;
};

const generateBookMarkHtml = function (bookmark) {
  let togBookmark = !bookmark.expand ? "bookmark-hide" : "";
  let rateBookmark = ratingStar(bookmark);
  return `
      <div class="bookmark-condensed-container collapsed-bm-container" data-item-id="${bookmark.id}">
        <button class="expand-button jq-exp-button">Expand Me!</button>  
        <h2 class="bookmark-name js-bookmark-name">${bookmark.title}</h2>
        <div class="bookmark-rating js-bookmark-rating">
          ${rateBookmark}
        </div>
        <div class="expnd-bm js-expnd-bm-container ${togBookmark}">
          <p>description: ${bookmark.desc}</p>
          <div class="actions">
            <a class="bookmark-URL jq-bm-url" href=${bookmark.url} target="_blank"><strong>Visit Site!</strong></a>
            <button class="delete-button jq-bm-delete">Delete Me!</button>
          </div>
        </div>
      </div>
    `;
};
//loop through bookmarks and display
const bookmarkHtmlCir = function (bookmarks) {
  const bmHTML = bookmarks.map((bookmark) => generateBookMarkHtml(bookmark));

  return bmHTML.join("");
};

const bookmarkInit = function () {
  $("#main").html(`
    <header role="banner">
    <h1>Store Your Bookmarks!</h1>
  </header>
  <!-- BOOKMARKS CONTROLS-->
  <div class="first-container" role="main">
    <div class="bm-container">
      <section class="bookmark-controls">
        <button class="add-button jq-add-button">+Add New!</button><br>
        <div class="filter-container">
          <label for="filter"> Filter by:</label>
          <select name="star-rating" id="filter">
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
          </div>
        </select>
      </section>
  <!-- BOOKMARKS DISPLAY -->
      <section class="bm-container jq-bm-container">
      </section>
    </div>
  </div>`);
};

const handleBookmarkToggleForm = function () {
  return `
<div class="add-bm-container">
<form class="add-bookmark-form"> 
  <fieldset role="group">
    <legend class="form">Bookmark Information</legend>
    <label class="form" for="title">Title:</label><br>
    <input type="text" id="title" name="title" required><br>
    <div class"bookmark-hide" role="radiogroup" aria-labelledby="rating">
      <label class="form" id="rating">Rating:</label><br>
      <label class="bookmark-hide" for="rating5">5*</label>
      <input type="radio" name="rating" id="rating5" value="5" checked>
      <label class="bookmark-hide" for="rating4">4*</label>
      <input type="radio" name="rating" id="rating4" value="4">
      <label class="bookmark-hide" for="rating3">3*</label>
      <input type="radio" name="rating" id="rating3" value="3">
      <label class="bookmark-hide" for="rating2">2*</label>
      <input type="radio" name="rating" id="rating2" value="2">
      <label class="bookmark-hide" for="rating1">1*</label>
      <input type="radio" name="rating" id="rating1" value="1"><br>
    </div>
    <label for="description" class="form">description:<br>
      <textarea name="desc" id="bookmark-description" cols="40" rows="5" ></textarea>
    </label><br>
    <label class="form" for="url">URL:</label><br>
    <input type="url" name="url" id="url" required><br>
    <div class="required-message">
    <p class="url-requirements">URLs <i>must</i> contain HTTP/HTTPS</p>
    </div>
    <div class="actions">
      <input type="submit" value="Submit">
      <input type="reset" value="Reset"> 
      <input type="button" value="Cancel" class="jq-cancel-bm">
    </div>
  </fieldset>
</form>
</div>
`;
};

// /*

// GENERATE ERROR MESSAGE

// */

const generateError = function (errMessage) {
  return `
    <div class="err-container jq-err-container">
      <button id="cancel">X</button>
      <h2>ERROR!</h2>
      <p>${errMessage}</p>
    </div>
    `;
};

const renderClose = function () {
  $(".jq-err-container").remove();
};

// if there is an error, render error container
const errRender = function () {
  if (STORE.error) {
    if (STORE.adding) {
      const errMessage = generateError(STORE.error);
      $(".bm-container").after(errMessage);
    } else if (!STORE.adding) {
      const errMessage = generateError(STORE.error);
      $(".bookmark-controls").after(errMessage);
    }
  } else {
    $(".jq-err-container").empty();
  }
};

/*

EVENT LISTENERS

*/

const stringJson = function (form) {
  const formData = new FormData(form);
  const mark = {};
  formData.forEach((val, name) => (mark[name] = val));
  return JSON.stringify(mark);
};

//toggle true false - add
const handleAddNewBookmark = function () {
  $("#main").on("click", ".jq-add-button", function () {
    console.log("this is working");
    if (!STORE.adding) {
      STORE.adding = true;
    }
    render();
  });
};

//submit new bookmarks
const handleNewBookmarkSubmit = function () {
  $(".add-bookmark-form").submit(function (event) {
    event.preventDefault();

    let eleForm = $(".add-bookmark-form")[0];
    let jsonObj = stringJson(eleForm);

    api
      .saveBookmark(jsonObj)
      .then((newMark) => {
        STORE.addBookmark(newMark);
        render();
      })
      .catch((evt) => {
        STORE.setError(evt.message);
        errRender();
      });
    render();
  });
};

//target bookmark ids
const bmIDVal = function (targetElement) {
  return $(targetElement).closest(".collapsed-bm-container").data("item-id");
};

//expand bookmark details on click
const handleBookmarkExpand = function () {
  $(".jq-bm-container").on("click", ".jq-exp-button", (e) => {
    const id = bmIDVal(e.currentTarget);
    STORE.expandBookmark(id);
    render();
  });
};

//Delete bookmark from api/store
const handleBookmarkDelete = function () {
  $(".jq-bm-delete").click((e) => {
    const idDelete = $(e.currentTarget)
      .parent()
      .parent()
      .parent()
      .data("item-id");
    api
      .deleteBookmark(idDelete)
      .then(() => {
        STORE.deleteBookmark(idDelete);
        render();
      })
      .catch((evt) => {
        STORE.setError(evt.message);
        errRender();
      });
  });
};

const handleErrorClose = function () {
  $(".bm-container").on("click", "#cancel", () => {
    renderClose();
    STORE.setError(null);
  });
};

const handleBookmarkCancel = function () {
  $(".jq-cancel-bm").on("click", function () {
    STORE.setAdding(false);
    render();
  });
};

const handleBookmarkFilter = function () {
  $("#filter").change(() => {
    let filterInp = $("#filter").val();
    STORE.filterBookmarks(filterInp);
    render();
  });
};

/*

RENDERING

*/

const render = function () {
  $("#main").html(bookmarkInit());
  if (STORE.adding) {
    $(".bookmark-controls").toggleClass("bookmark-hide");
    $(".jq-err-container-main").toggleClass("bookmark-hide");
    $(".jq-bm-container").html(handleBookmarkToggleForm());
    errRender();
    bindEventListeners();

    //if any bookmarks, display those
  } else if (STORE.filter) {
    let bookmarksFilteredCopy = [...STORE.filteredBookmarks];
    const bookmarkFilteredHtml = bookmarkHtmlCir(bookmarksFilteredCopy);
    $(".jq-bm-container").html(bookmarkFilteredHtml);
    errRender();
    STORE.filteredBookmarks = [];
    bindEventListeners();
  } else {
    const bookmarkHtml = bookmarkHtmlCir(STORE.bookmarks);
    $(".jq-bm-container").html(bookmarkHtml);
    errRender();
    bindEventListeners();
  }
};

/*

BINDING EVENT LISTENERS

*/

const bindEventListeners = function () {
  handleErrorClose();
  handleBookmarkFilter();
  handleBookmarkCancel();
  handleBookmarkDelete();
  handleBookmarkExpand();
  handleAddNewBookmark();
  handleNewBookmarkSubmit();
};

/*

EXPORT DEFAULT

*/

export default {
  bindEventListeners,
  render,
};
