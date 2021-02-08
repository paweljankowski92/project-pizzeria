import {select, templates, classNames} from '../settings.js';
import Carousel from './Carousel.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidgets();
    thisHome.initActions();
  }

  render(element){
    const thisHome = this;

    const generatedHTML = templates.home();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.carousel = document.querySelector(select.widgets.carousel);
    thisHome.dom.orderOnline = document.querySelector(select.home.orderOnline);
    thisHome.dom.bookTable = document.querySelector(select.home.bookTable);
    thisHome.dom.pages = document.querySelector(select.containerOf.pages).children;
    thisHome.dom.navLinks = document.querySelectorAll(select.nav.links);
    console.log('thisHome.dom.orderOnline', thisHome.dom.orderOnline);
    console.log('thisHome.dom.bookTable', thisHome.dom.bookTable);

  }

  initWidgets() {
    const thisHome = this;

    thisHome.carouselwidget = new Carousel(thisHome.dom.carousel);
    console.log('thisHome.carousel', thisHome.carouselwidget);
  }

  initActions(){
    const thisHome = this;

    thisHome.dom.orderOnline.addEventListener('click', function(event) {
      event.preventDefault();
      thisHome.dom.pages[0].classList.remove(classNames.pages.active);
      thisHome.dom.navLinks[0].classList.remove(classNames.nav.active);
      thisHome.dom.pages[1].classList.add(classNames.pages.active);
      thisHome.dom.navLinks[1].classList.add(classNames.nav.active);
    });

    thisHome.dom.bookTable.addEventListener('click', function(event) {
      event.preventDefault();
      thisHome.dom.pages[0].classList.remove(classNames.pages.active);
      thisHome.dom.navLinks[0].classList.remove(classNames.nav.active);
      thisHome.dom.pages[2].classList.add(classNames.pages.active);
      thisHome.dom.navLinks[2].classList.add(classNames.nav.active);
    });

    console.log('thisHome.dom.pages', thisHome.dom.pages);
    console.log('thisHome.dom.navLinks', thisHome.dom.navLinks);

  }
}

export default Home;
