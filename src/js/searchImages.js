import ImagesApiService from './components/apiService';
import LoadMoreBtn from './components/loadMoreBtn';
import onModalOpen from './components/modal';
import getRefs from './getRefs';
import { error } from '@pnotify/core';
import galleryTpl from '../templates/gallery.hbs';
import debounce from 'lodash.debounce';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const refs = getRefs();
const imagesApiService = new ImagesApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

refs.galleryList.addEventListener('click', onModalOpen);

refs.searchInput.addEventListener('input', debounce(onSearch, 500));
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

function onSearch(e) {
  onInputClear();
  imagesApiService.query = e.target.value;

  if (!imagesApiService.query) {
    return;
  } else {
    loadMoreBtn.show();
    imagesApiService.resetPage();
    fetchImages();
  }
}

const onInputClear = () => {
  refs.galleryList.innerHTML = '';
  loadMoreBtn.hide();
};

function fetchImages() {
  loadMoreBtn.disable();

  return imagesApiService
    .fetchImages()
    .then(images => {
      setTimeout(() => {
        renderImages(images), loadMoreBtn.enable();
      }, 300);
    })
    .catch(handleFetchError);
}

const renderImages = images => {
  console.log(images);
  const imagesQuantity = images.length;
  if (imagesQuantity === 0) {
    loadMoreBtn.hide();
    handleFetchError();
  }

  const imageMarkup = galleryTpl(images);
  renderMarkup(imageMarkup);
};

const renderMarkup = markup => {
  refs.galleryList.insertAdjacentHTML('beforeend', markup);
};

function handleFetchError() {
  error({
    text: 'Invalid request',
    hide: true,
    delay: 1500,
  });
}

function onLoadMore() {
  fetchImages();
  scrollGallery();
}

function scrollGallery() {
  const totalScrollHeight = refs.galleryList.clientHeight + 100;
  setTimeout(() => {
    window.scrollTo({
      top: totalScrollHeight,
      behavior: 'smooth',
    });
  }, 500);
}
