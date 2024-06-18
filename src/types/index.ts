// Тип для описания ошибок формы заказа
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// Интерфейс для результата создания заказа
export interface IOrderResult {
	id: string[];
	total: number;
	error?: string;
}

// Интерфейс для описания продукта
export interface IProduct {
	id: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	category: string;
}

// Интерфейс для списка продуктов с общим количеством
export interface IProducts {
	total: number;
	items: IProduct[];
}

// Интерфейс для заказа
export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

// Интерфейс для API методов
export interface IWebLakerApi {
	getProducts: () => Promise<IProducts>;
	getProduct: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderResult>;
}


