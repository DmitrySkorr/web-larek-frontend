// Импорт базового компонента и вспомогательных функций.
import { Component } from '../components/base/Component';
import { ensureElement } from '../utils/utils';
import { IEvents } from '../components/base/events';

// Интерфейс для данных модального окна.
interface IModalData {
	content: HTMLElement; // Содержимое модального окна.
}

// Класс модального окна, наследуется от базового компонента.
export class Modal extends Component<IModalData> {
	protected _closeButton: HTMLButtonElement; // Кнопка закрытия модального окна.
	protected _content: HTMLElement; // Содержимое модального окна.

	// Конструктор принимает контейнер и объект событий.
	constructor(container: HTMLElement, protected events: IEvents) {
		super(container); // Вызов конструктора базового класса.

		// Инициализация кнопки закрытия и содержимого модального окна.
		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close', // CSS-селектор кнопки закрытия.
			container // Контейнер модального окна.
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		// Добавление обработчиков событий для закрытия модального окна.
		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Сеттер для содержимого модального окна.
	set content(value: HTMLElement) {
		this._content.replaceChildren(value); // Замена содержимого.
	}

	// Метод для открытия модального окна.
	open() {
		this.container.classList.add('modal_active'); // Добавление класса для отображения модального окна.
		this.events.emit('modal:open'); // Вызов события открытия модального окна.
	}

	// Метод для закрытия модального окна.
	close() {
		this.container.classList.remove('modal_active'); // Удаление класса отображения.
		this.content = null; // Очистка содержимого.
		this.events.emit('modal:close'); // Вызов события закрытия модального окна.
	}

	// Метод для рендеринга модального окна с данными.
	render(data: IModalData): HTMLElement {
		super.render(data); // Вызов метода рендеринга базового класса.
		this.open(); // Открытие модального окна.
		return this.container; // Возврат контейнера.
	}
}
