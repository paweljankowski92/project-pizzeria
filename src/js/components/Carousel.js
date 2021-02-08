
class Carousel {
  constructor(element) {
    const thisCarousel = this;
    thisCarousel.render(element);
    thisCarousel.initPlugin();
  }

  render(element) {
    const thisCarousel = this;
    // save element ref to this ob
    thisCarousel.wrapper = element;
  }

  initPlugin() {
    // use plugin to create carousel on thisCarousel.element
    const thisCarousel = this;

    const flickity = new Flickity (thisCarousel.wrapper, {
      cellAlign: 'left',
      wrapAround: true,
      contain: true,
      prevNextButtons: false,
      autoPlay: true,
    });
  }
}

export default Carousel;
