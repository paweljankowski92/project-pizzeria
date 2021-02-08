import {select, templates} from '../settings.js';
import Carousel from './Carousel.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
    // thisHome.initActions();
  }

  render(element){
    const thisHome = this;

    const generatedHTML = templates.home();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.carousel = document.querySelector(select.widgets.carousel);
  }

  initWidgets() {
    const thisHome = this;

    thisHome.carouselwidget = new Carousel(thisHome.dom.carousel);
    console.log('thisHome.carousel', thisHome.carouselwidget);
  }
}

export default Home;
