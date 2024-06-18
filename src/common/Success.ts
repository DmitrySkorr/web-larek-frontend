import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';

// Интерфейс для данных успеха
interface ISuccess {
  title: string;
  description: string;
}

// Интерфейс для действий, связанных с успехом
interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
  // Приватные переменные для элементов
  private _close: HTMLElement;
  private _title: HTMLElement;
  private _desc: HTMLElement;

  // Конструктор класса
  constructor(container: HTMLElement, actions: ISuccessActions) {
    super(container);
    
    // Инициализация элементов
    this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
    //this._close = this._getElement('.order-success__close');
    this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
    //this._title = this._getElement('.order-success__title');
    this._desc = ensureElement<HTMLElement>('.order-success__description', this.container);
    //this._desc = this._getElement('.order-success__description');

    // Привязка события клика к кнопке закрытия, если действие передано
    if (actions?.onClick) {
      this._close.addEventListener('click', actions.onClick);
    }
  }

  // Вспомогательный метод для получения элемента
  /*private _getElement(selector: string): HTMLElement {
    return ensureElement(selector, this.container);
  }*/

  // Сеттер для заголовка
  /*set title(value: string) {
    this._setText(this._title, value);
  }

  // Сеттер для описания
  set description(value: string) {
    this._setText(this._desc, value);
  }

  // Метод для установки текста элемента
  private _setText(element: HTMLElement, text: string): void {
    element.textContent = text;
  }*/
}
