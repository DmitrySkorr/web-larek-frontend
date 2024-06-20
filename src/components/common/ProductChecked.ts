import { ensureElement } from '../../utils/utils'; // Импорт утилиты для гарантированного получения элемента DOM
import { Component } from '../base/Component'; // Импорт базового класса компонента

interface IProductActions {
	// Интерфейс для действий с продуктом, включает обработчик клика
	onClick: (event: MouseEvent) => void;
}

export interface IProduct<T> {
	// Интерфейс продукта с обобщенным типом T для статуса
	index: number;
	title: string;
	description: string;
	price: string;
	image: string;
	category: string;
	status: T;
}

// Словарь для категорий продуктов
const ProductCategory = {
	'софт-скил': 'soft',
	'другое': 'other',
	'кнопка': 'button',
	'хард-скил': 'hard',
	'дополнительное': 'additional',
};

export class Product<T> extends Component<IProduct<T>> {
	// Поля класса для элементов DOM
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _category: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string, // Имя блока для поиска элементов DOM
		container: HTMLElement, // Контейнер, в котором находятся элементы продукта
		actions?: IProductActions // Опциональные действия для продукта
	) {
		super(container);
		// Инициализация элементов DOM с помощью утилиты ensureElement
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._button = container.querySelector(`.${blockName}__button`);
		this._description = container.querySelector(`.${blockName}__description`);
		this._price = container.querySelector(`.${blockName}__price`);
		this._category = container.querySelector(`.${blockName}__category`);

		// Привязка обработчика клика, если он передан
		if (actions?.onClick) {
			(this._button || container).addEventListener('click', actions.onClick);
		}
	}

	// Сеттер и геттер для идентификатора продукта
	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	// Сеттер и геттер для заголовка продукта
	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	// Сеттер и геттер для категории продукта
	//set category(value: keyof typeof ProductCategory) {
	//	this.setText(this._category, value);
	//	this._category.classList.add(`card__category_${ProductCategory[value]}`);
	//}
	set category(value: keyof typeof ProductCategory) {
		if (this._category) {
			this.setText(this._category, value);
			const categoryStyle = `card__category_${ProductCategory[value]}`;
			this._category.classList.add(categoryStyle);
		}
	}


	get category(): keyof typeof ProductCategory {
		return this._category.textContent as keyof typeof ProductCategory;
	}

	// Сеттер и геттер для цены продукта
	set price(value: string | null) {
		this.setText(this._price, value + ' синапсов' ?? '');
	}

	get price(): string {
		return this._price.textContent + ' синапсов' || '';
	}

	// Сеттер для изображения продукта
	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	// Сеттер для описания продукта
	set description(value: string | string[]) {
        if (Array.isArray(value)) {
            this._description.replaceWith(...value.map(str => {
                const descTemplate = this._description.cloneNode() as HTMLElement;
                this.setText(descTemplate, str);
                return descTemplate;
            }));
        } else {
            this.setText(this._description, value);
        }
    }
}


// Тип для статуса элемента каталога
export type CatalogItemStatus = {
	status: boolean;
}

export class CatalogItem extends Product<CatalogItemStatus> {
	constructor(container: HTMLElement, actions?: IProductActions) {
		super('card', container, actions);
		// Инициализация изображения продукта для элемента каталога
		this._image = ensureElement<HTMLImageElement>(`.card__image`, container);
	}

	// Сеттер для статуса элемента каталога
	set status({ status }: CatalogItemStatus) {
		if (this._button) {
			const text = !this.price ? 'Недоступно' : status ? 'Уже в корзине' : 'В корзину';
			this.setText(this._button, text);
			this._button.disabled = !this.price || status;
		}
	}
}

// Тип для статуса элемента корзины
export type BasketItemStatus = {
	index: number;
}

export class BasketItem extends Product<BasketItemStatus> {
	protected _index: HTMLElement;

	constructor(container: HTMLElement, actions?: IProductActions) {
		super('card', container, actions);
		// Инициализация элемента индекса для элемента корзины
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, container);
	}

	// Сеттер для индекса элемента корзины
	set index(value: number) {
		this.setText(this._index, value.toString());
	}
}
