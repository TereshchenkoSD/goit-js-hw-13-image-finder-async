import ImagesApiService from './components/apiService';
import onModalOpen from './components/modal';
import getRefs from './getRefs';
import { error } from '@pnotify/core';
import galleryTpl from '../templates/gallery.hbs';
import debounce from 'lodash.debounce';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/core/dist/PNotify.css';

const refs = getRefs();
const imagesApiService = new ImagesApiService();

refs.galleryList.addEventListener('click', onModalOpen);

refs.searchInput.addEventListener('input', debounce(onSearch, 500));

function onSearch(e) {
  onInputClear();
  imagesApiService.query = e.target.value;

  if (!imagesApiService.query) {
    return;
  } else {
    imagesApiService.resetPage();
    fetchImages();
  }
}

const onInputClear = () => {
  refs.galleryList.innerHTML = '';
  observer.disconnect(refs.sentinel);
};

function fetchImages() {
  return imagesApiService
    .fetchImages()
    .then(images => {
      renderImages(images);
      imagesApiService.incrementPage();
      observer.observe(refs.sentinel);
    })
    .catch(handleFetchError);
}

const renderImages = images => {
  console.log(images);
  const imagesQuantity = images.length;
  if (imagesQuantity === 0) {
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

const onEntry = entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && imagesApiService.query !== '') {
      fetchImages();
    }
  });
};

const options = {
  rootMargin: '300px',
};

const observer = new IntersectionObserver(onEntry, options);
