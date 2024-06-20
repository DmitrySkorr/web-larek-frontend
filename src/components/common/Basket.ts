import { IEvents } from '../base/events';
import { Component } from "../base/Component";
import { createElement, ensureElement } from "../../utils/utils";

// Интерфейс для представления корзины
interface IBasketView {
  items: HTMLElement[];
  total: number;
}

// Класс для управления корзиной, наследует базовый компонент
export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // Инициализация элементов корзины
    this._list = ensureElement<HTMLElement>('.basket__list', this.container);
    this._total = ensureElement<HTMLElement>('.basket__price', this.container);
    this._button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    // Добавление обработчика для кнопки оформления заказа
    this._button.addEventListener('click', () => {
      events.emit('order:open');
    });

    this.items = [];
  }

  // Установка списка элементов в корзине
  set items(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.setDisabled(this._button, false);
      //this._button.disabled = false;
    } else {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>('p', {
          textContent: 'Корзина пуста',
        })
      );
      this._button.disabled = true;
    }
  }

  // Установка общей стоимости в корзине
  set total(total: number) {
    this.setText(this._total, `${total} синапсов`);
  }
}

