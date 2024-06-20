import { Form } from './Form';
import { IOrder } from '../../types/index';
import { IEvents } from '../base/events';

// Класс заказа, наследуется от Form
export class Order extends Form<IOrder> {
  // свойство для альтернативных кнопок
  protected _altButtons: HTMLButtonElement[];

  // Конструктор класса
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this._altButtons = this._initializeAltButtons(container);
  }

  // Метод для инициализации альтернативных кнопок
  private _initializeAltButtons(container: HTMLElement): HTMLButtonElement[] {
    const buttons = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];
    buttons.forEach(button => {
      button.addEventListener('click', () => this._handleAltButtonClick(button));
    });
    return buttons;
  }

  // Обработчик клика по альтернативной кнопке
  private _handleAltButtonClick(button: HTMLButtonElement): void {
    this._altButtons.forEach(btn => this.toggleClass(btn, 'button_alt-active', false));
    this.toggleClass(button, 'button_alt-active', true);
    this.payment = button.name;
  }

  // Сеттер для установки номера телефона
  set phone(value: string) {
    this._setInputValue('phone', value);
  }

  // Сеттер для установки email
  set email(value: string) {
    this._setInputValue('email', value);
  }

  // Сеттер для установки адреса
  set address(value: string) {
    this._setInputValue('address', value);
  }

  // Сеттер для установки типа оплаты
  set payment(value: string) {
    this.events.emit('order:setPaymentType', { paymentType: value });
  }

  // Вспомогательный метод для установки значения input
  private _setInputValue(name: string, value: string): void {
    const input = this.container.elements.namedItem(name) as HTMLInputElement;
    if (input) {
      input.value = value;
    }
  }
}
