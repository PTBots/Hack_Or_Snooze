"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".user-nav-bar").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

//click to show my stories

function myStories(e) {
  console.debug("myStories", e);
  hidePageComponents();
  putUserStoriesOnPage();
  $myStories.show();
}

$body.on("click", "#nav-my-stories", myStories);

//click to upload story

function navUploadStory(e) {
  console.debug("uploadStory", e);
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navUploadStory.on("click", navUploadStory)

//click to make story a favorite

function navFavClick(e) {
  console.debug("navFavClick", e);
  hidePageComponents();
  putFavoritesOnPage()
}

$body.on("click", "#nav-favorites", navFavClick);

