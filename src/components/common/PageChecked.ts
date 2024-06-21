import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

// Интерфейс для страницы
interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}

export class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _catalog: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Инициализация элементов страницы
    this._counter = ensureElement<HTMLElement>('.header__basket-counter');
   // this._counterElem = this._getElement('.header__basket-counter');
    this._catalog = ensureElement<HTMLElement>('.gallery');
    //this._catalog = this._getElement('.gallery');
    this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
    this._basket = ensureElement<HTMLElement>('.header__basket');
    //this._basket = this._getElement('.header__basket');
    //this._basket = this._getElement('.header__basket');

    // Привязка события клика к корзине
    this._bindBasketEvent();
  }

  // Метод для привязки события открытия корзины
  private _bindBasketEvent(): void {
    this._basket.addEventListener('click', () => {
      this.events.emit('cart:open');
    });
  }

  // Сеттер для счетчика
  set counter(value: number) {
    this.setText(this._counter, value.toString());
  }

  // Сеттер для каталога
  set catalog(items: HTMLElement[]) {
    this._catalog.innerHTML = '';
    this._catalog.append(...items);
  }

  // Сеттер для блокировки страницы
  set locked(value: boolean) {
    this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
  }



  // Метод для добавления/удаления класса в зависимости от условия
  
}
