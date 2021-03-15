import {select, templates, classNames, settings} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';

class Product{
  constructor (id, data){

    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderFrom();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();
    // console.log('new Product:' , thisProduct);
  }
  renderInMenu(){

    const thisProduct = this;
    /*generate HTML based on templae*/
    const generatedHTML = templates.menuProduct(thisProduct.data);
    // console.log('generatedHTML', generatedHTML);
    /*create element using utils.createElementFromHTML */
    thisProduct.element = utils.createDOMFromHTML(generatedHTML);
    /*find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);
    /*add element to menu*/
    menuContainer.appendChild(thisProduct.element);
  }

  getElements(){
    const thisProduct = this;
    // thisProduct.dom = {};
    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion() {
    const thisProduct = this;

    /* START: add event listener to clickable trigger on event click */
    thisProduct.accordionTrigger.addEventListener('click', function(event) {
    /* prevent default action for event */
      event.preventDefault();

      /* find active product (product that has active class) */
      const activeProducts = document.querySelectorAll('.product.active');
      // console.log('activeProducts', activeProducts);
      /* if there is active product and it's not thisProduct.element, remove class active from it */

      for (let activeProduct of activeProducts) {
        if (activeProduct !== thisProduct.element){
          activeProduct.classList.remove('active');
        }
        /* toggle active class on thisProduct.element */
      }

      thisProduct.element.classList.toggle('active');
    });
  }

  initOrderFrom () {
    const thisProduct = this;

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  initAmountWidget() {
    const thisProduct = this;
    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  processOrder() {
    const thisProduct = this;
    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    // console.log('formData', formData);
    // set price to default price
    let price = thisProduct.data.price;
    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      // console.log(paramId, param);
      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        // const optionsSelected = formData.hasOwnProperty;
        if (formData[paramId] && formData[paramId].includes(optionId)) {
          if(option && !option.default) {
            price += option.price;
          }
        }
        else {
          if(option && option.default) {
            price -= option.price;
          }
        }
        const optionImage = thisProduct.imageWrapper.querySelector('.'+ paramId + '-' + optionId);
        // console.log('optionimage', optionImage);
        if(optionImage) {
          if(formData[paramId] && formData[paramId].includes(optionId)) {
            optionImage.classList.add(classNames.menuProduct.imageVisible);
          }
          else {
            optionImage.classList.remove(classNames.menuProduct.imageVisible);
          }
        }
      }
    }
    //multiply price by amoun//
    thisProduct.priceSingle = price;
        price *= thisProduct.amountWidget.value;
        thisProduct.priceMulti = price;
        thisProduct.priceElem.innerHTML = price;

  }
  addToCart() {
    const thisProduct = this;

    // app.cart.add(thisProduct.prepareCartProduct());
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct()
      },
    });

    thisProduct.element.dispatchEvent(event);

  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceMulti,
      params: thisProduct.prepareCartProductParams()
    };
    return productSummary;

  }

  prepareCartProductParams () {
    const thisProduct = this;
    // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
    const formData = utils.serializeFormToObject(thisProduct.form);
    const params = {};
    // for every category (param)...
    for(let paramId in thisProduct.data.params) {
      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];

      params[paramId] = {
        name: param.label,
        options: {}
      };
      // for every option in this category
      for(let optionId in param.options) {
        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);
        // const optionsSelected = formData.hasOwnProperty;
        if(optionSelected) {
          params[paramId].options[option.label] = option.label;
        }
      }
    }

    return params;
  }
}

export default Product;
