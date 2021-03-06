'use strict';

const opt = {
  select: {
    booksList: '.books-list',
    bookImage: 'book__image',
    filterForm: '.filters',
    dataID: 'data-id',
  },
  classNames: {
    favorite: 'favorite',
    hidden: 'hidden',
  },
  settings: {
    rating: {
      bgc1: 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)',
      bgc2: 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)',
      bgc3: 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)',
      bgc4: 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)',
    }
  },
  templates: {
    bookTemplate: Handlebars.compile(document.querySelector('#template-book').innerHTML),
  }
};
const arrays = {
  favoriteBooks: [],
  filters: [],
};

class BooksList {
  constructor() {
    const thisBooksList = this;

    thisBooksList.initData();
    thisBooksList.getElements();
    thisBooksList.render();
    thisBooksList.initActions();
  }
  initData() {
    const thisBooksList = this;

    thisBooksList.data = dataSource.books;
  }
  getElements() {
    const thisBooksList = this;

    thisBooksList.dom = {};
    thisBooksList.dom.booksList = document.querySelector(opt.select.booksList);
    thisBooksList.dom.filterForm = document.querySelector(opt.select.filterForm);
  }
  render(){
    const thisBooksList = this;

    for(let book of thisBooksList.data){
      book.ratingBgc = thisBooksList.determineRatingBgc(book.rating),
      book.ratingWidth = book.rating * 10;

      const generatedHTML = opt.templates.bookTemplate(book),
        generatedDOM = utils.createDOMFromHTML(generatedHTML);

      thisBooksList.dom.booksList.appendChild(generatedDOM);
    }
  }
  initActions(){
    const thisBooksList = this;

    thisBooksList.dom.booksList.addEventListener('dblclick', function(event){
      const bookImageID = event.target.offsetParent.getAttribute(opt.select.dataID);

      event.preventDefault();

      if(event.target.offsetParent.classList.contains(opt.select.bookImage)){
        if(!arrays.favoriteBooks.includes(bookImageID)){
          event.target.offsetParent.classList.add(opt.classNames.favorite);
          arrays.favoriteBooks.push(bookImageID);
        } else {
          arrays.favoriteBooks.splice(arrays.favoriteBooks.indexOf(bookImageID), 1);
          event.target.offsetParent.classList.remove(opt.classNames.favorite);
        }
      }
    });
    thisBooksList.dom.filterForm.addEventListener('click', function(event){
      if(event.target.tagName === 'INPUT' && event.target.type === 'checkbox' && event.target.name === 'filter'){
        if(event.target.checked){
          arrays.filters.push(event.target.value);
        } else {
          arrays.filters.splice(arrays.filters.indexOf(event.target.value), 1);
        }
      }
      thisBooksList.filterBooks(); // this != thisBooksList
    });
  }
  filterBooks(){
    const thisBooksList = this;

    for(let book of thisBooksList.data){
      const bookDOM = document.querySelector('.book__image[data-id="' + book.id + '"]');
      let shouldBeHidden = false;

      for(const filter of arrays.filters){
        if(!book.details[filter]) {
          shouldBeHidden = true;
          break;
        }
      }
      console.log(shouldBeHidden);
      if(shouldBeHidden){
        bookDOM.classList.add(opt.classNames.hidden);
      } else {
        bookDOM.classList.remove(opt.classNames.hidden);
      }
    }
  }
  determineRatingBgc(rating){
    let ratingBackground = '';

    if(rating < 6){
      ratingBackground = opt.settings.rating.bgc1;
    } else if(rating > 6 && rating <= 8){
      ratingBackground = opt.settings.rating.bgc2;
    } else if(rating > 8 && rating <= 9){
      ratingBackground = opt.settings.rating.bgc3;
    } else if(rating > 9){
      ratingBackground = opt.settings.rating.bgc4;
    }

    return ratingBackground;
  }
}

const app = new BooksList(); //eslint-disable-line no-unused-vars
