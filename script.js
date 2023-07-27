const imageContainer = document.getElementById("image-container");
const loadingSpinner = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];

// Unsplash API
let initialPictureLoad = 5;
const accessKey = "API_ACCESS_KEY";
let apiUrl;
const nextPictureLoad = 30;

function updateAPIUrlWithPictureCount(countParam) {
  apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${countParam}`;
}
updateAPIUrlWithPictureCount(initialPictureLoad);

function checkAllImagesHadLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loadingSpinner.hidden = true;
    // Reload APi Url with new picture load
    updateAPIUrlWithPictureCount(nextPictureLoad);
  }
}

function setElementAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elements for Links and Photos and Add to the DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each Object in photosArray
  photosArray.forEach((photo) => {
    // Create an <a> tag to link to Unsplash
    let photoLink = document.createElement("a");
    setElementAttributes(photoLink, {
      href: photo.links.html,
      target: "_blank",
    });
    // Create an <img> tag for photo
    let img = document.createElement("img");
    setElementAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });
    // Event Listener, check when each is finished loading
    img.addEventListener("load", checkAllImagesHadLoaded);
    // Put <img> inside <a>, then put both inside imageContainer Element
    photoLink.appendChild(img);
    imageContainer.appendChild(photoLink);
  });
}

async function getPhotosFromUnsplashApi() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
  } catch (error) {
    // Catch errors Here
  }
}

// Check to see if scrolling near bottom of page, Load More Photos
window.addEventListener("scroll", () => {
  if (
    // Note to myself: previous code using "document.body.offsetHeight" was buggy and triggered the API event as soon as scroll begun.
    window.innerHeight + window.scrollY >= document.body.scrollHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotosFromUnsplashApi();
  }
});
// On Load
getPhotosFromUnsplashApi();
