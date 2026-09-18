import './components.css';
import { initializeHeader } from './modules/header';
import { initializeSellForm } from './modules/sell-form';
import { renderCollection } from './modules/collection';
import { renderArtworkDetail } from './modules/artwork-detail';

initializeHeader();
initializeSellForm();

const page = document.body.dataset.page;
if (page === 'collection') void renderCollection();
if (page === 'artwork') void renderArtworkDetail();
