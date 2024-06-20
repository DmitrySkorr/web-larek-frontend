import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

// Интерфейс для данных, передаваемых в компонент Success
interface ISuccess {
	title: string;
	description: string;
}

// Интерфейс для действий, передаваемых в компонент Success
interface ISuccessActions {
	onClick: () => void;
}

// Класс Success, наследуемый от базового класса Component
export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _title: HTMLElement;
	protected _description: HTMLElement;

	// Конструктор принимает контейнер для компонента и действия
	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		// Инициализация элементов с использованием функции ensureElement
		this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
		this._title = ensureElement<HTMLElement>('.order-success__title', this.container);
		this._description = ensureElement<HTMLElement>('.order-success__description', this.container);

		// Добавление обработчика события на кнопку закрытия, если он передан
		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	// Сеттер для свойства title
	set title(value: string) {
		this.setText(this._title, value);
	}

	// Сеттер для свойства description
	set description(value: string) {
		this.setText(this._description, value);
	}
}
