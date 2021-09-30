"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn) {
  // console.debug("generateStoryMarkup", story);

  const host = story.getHostName();

  const showStar = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
        ${showDeleteBtn ? deleteBtn() : ""}
        ${showStar ? addRemoveStar(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${host})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function deleteBtn() {
  return 
    `<span class="delete">
      <i class="far fa-trash" aria-hidden="true"></i>
    </span>`;
}

//select/deselect favorite stories

function addRemoveStar(story,user){
  const isFavorite = user.isFavorite(story);
  const star = isFavorite ? "fas" : "far";
  return `<span class="star">
            <i class="${star} fa-star"</i>
          </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

//delete a story

async function deleteStory(e) {
  console.debug("deleteStory");

  const $closestLi = $(e.target).closest("li");
  const storyId = $closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  //repopulate the stories list
  await putUserStoriesOnPage
}

$myStories.on("click", ".delete", deleteStory);

//add story to page

async function addStory(e) {
  console.debug("addStory");
  e.preventDefault();

  //get all information off of form
  const author = $("#author").val();
  const title = $("#title").val();
  const url = $("#url").val();
  const username = currentUser.username;
  const storyInfo = {title, url, author, username};

  const story = await storyList.addStory(currentUser, storyInfo);

  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);

  //hide and reset the form
  $submitForm.slideUp("slow");
  $submitForm.trigger("reset");
}

$submitForm.on("submit", addStory);

//add favorites to page

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $favoritesList.empty();

  if (currentUser.favorites.length === 0) {
    $favoritesList.append("<h4>No favorites yet!</h4>");
  } else {
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritesList.append($story);
    }
  }
  $favoritesList.show();
}

//toggle favorite stories on and off

async function toggleFavoriteStories(e) {
  console.debug("toggleFavoriteStories");

  const $target = $(e.target);
  const $closestLi = $target.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavoriteStories);

//put user stories on page

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  
  $myStories.empty();

  if (currentUser.myStories.length === 0) {
    $myStories.append("<h4>No user stories yet!</h4>");
  } else {
    for (let story of currentUser.myStories) {
      let $story = generateStoryMarkup(story);
      $myStories.append($story);
    }
  }
  $myStories.show();
}