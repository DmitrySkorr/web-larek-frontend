import { Component } from "../components/base/Component";
import { IEvents } from "../components/base/events";
import { ensureElement } from "../utils/utils";

interface IFormState {
  valid: boolean;
  errors: string[];
}

// Класс для работы с формой, наследует базовый компонент
export class Form<T> extends Component<IFormState> {
  private _submit: HTMLButtonElement;
  private _errors: HTMLElement;

  constructor(protected container: HTMLFormElement, protected events: IEvents) {
    super(container);
    this._initializeElements();
    this._attachEventListeners();
  }

  // Инициализация элементов формы
  private _initializeElements() {
    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
    this._errors = ensureElement<HTMLElement>('.form__errors', this.container);
  }

  // Привязка обработчиков событий
  private _attachEventListeners() {
    this._attachInputListener();
    this._attachSubmitListener();
  }

  // Обработчик изменения ввода
  private _attachInputListener() {
    this.container.addEventListener('input', this._handleInputChange.bind(this));
  }

  // Обработчик изменения ввода
  private _handleInputChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.onInputChange(target.name as keyof T, target.value);
  }

  // Обработчик отправки формы
  private _attachSubmitListener() {
    this.container.addEventListener('submit', this._handleFormSubmit.bind(this));
  }

  // Обработчик отправки формы
  private _handleFormSubmit(e: Event) {
    e.preventDefault();
    this.events.emit(`${this.container.name}:submit`);
  }

  // Метод обработки изменения ввода
  protected onInputChange(field: keyof T, value: string) {
    this.events.emit(`${this.container.name}.${String(field)}:change`, { field, value });
  }

  // Установка валидности формы
  set valid(value: boolean) {
    this._submit.disabled = !value;
  }

  // Установка ошибок формы
  set errors(value: string[]) {
    this.setText(this._errors, value);
  }

  // Метод рендеринга состояния формы
  render(state: Partial<T> & IFormState) {
    const { valid, errors, ...inputs } = state;
    super.render({ valid, errors });
    Object.assign(this, inputs);
    return this.container;
  }
}
