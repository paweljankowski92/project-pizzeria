/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };
  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };
  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };
  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

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
      });
      console.log();
    }

    initAmountWidget() {
      const thisProduct = this;
      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener ('updated', function() {
        thisProduct.processOrder();
      })
    }

    processOrder() {
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
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
          const optionImage = thisProduct.imageWrapper.querySelector('.paramId-optionId');
          // console.log('optionimage', optionImage);
          // if (formData[paramId] && formData[paramId].includes(optionId)) {
          //
          // }


        }
      }
      //multiply price by amoun//
      price *= thisProduct.amountWidget.value;
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }
  }

  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      console.log ('AmountWidget', thisWidget);
      console.log ('constructorarguments', element);

      thisWidget.getElements(element);
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
    }
    getElements (element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }
    setValue (value) {
      const thisWidget = this;

      const newValue = parseInt(value);

      // TODO: Add validation
      if(thisWidget.value !== newValue && !isNaN(newValue) &&  thisWidget.value >= settings.amountWidget.defaultMin && thisWidget.value <= settings.amountWidget.defaultMin) {
        thisWidget.value = newValue;
      }
        thisWidget.input.value = thisWidget.value;
      }
      initActions () {
        const thisWidget = this;

        thisWidget.input.addEventListener('change', function(event) {
          thisWidget.setValue(thisWidget.input.value);
        });
        thisWidget.linkDecrease.addEventListener('click', function (event) {
          event.preventDefault();
          thisWidget.setValue(thisWidget.value = --thisWidget.value);
        });
        thisWidget.linkIncrease.addEventListener('click', function (event) {
          event.preventDefault();
          thisWidget.setValue(thisWidget.value = ++thisWidget.value);
        });
        }

        announce(){
          const thisWidget = this;

          const event = new Event('updated');
          thisWidget.element.dispatchEvent(event);
        }


      }

  const app = {
    initMenu: function (){
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);
      for(let productData in thisApp.data.products){
        new Product(productData, thisApp.data.products[productData]);
      }
    },
    initData: function() {
      const thisApp = this;

      thisApp.data = dataSource;
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}
