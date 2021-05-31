import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/dist/basicLightbox.min.css';

export default function onModalOpen(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }

  const instance = basicLightbox.create(`
    <img class="modal__image" src=${e.target.dataset.source} alt=${e.target.alt}/>`);
  instance.show();
}
