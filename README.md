# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
документация 

Сайт для разработчиков Web-larek.
используемый стек: webpack, TypeScript, HTML, Css.

установка и запуск:
npm install
npm run start

запуск в dev режиме: npm run dev  (добавлено для удобства работы)

сборка: npm run build

Структура проекта:
src/ — исходные файлы проекта
src/common/ — папка с JS компонентами
src/components/base/ — папка с базовым кодом

архитектура:
web-larek создан по принципу ооп с использованием mvp архитектуры (model - view - presenter)

Компоненты и модели данных (бизнес-логика)

Класс Component

Абстрактный базовый класс для компонентов интерфейса, предоставляющий методы управления ими, включая изменение текста, изображений, переключение классов и рендеринг. Класс является дженериком, принимающим тип данных компонентов через переменную T.

Конструктор: принимает элемент, с которым будет происходить взаимодействие.
Методы:
setText: изменение текста элемента.
setImage: изменение изображения элемента.
toggleClass: переключение класса элемента.
render: заполнение свойств элемента и получение его в формате HTMLElement.

Класс Model

Абстрактный класс для отличия компонентов от обычных объектов с данными, предоставляющий методы отслеживания изменений. Конструктор принимает компонент для отслеживания.

Методы:
emitChanges: уведомление об изменении модели.
Класс EventEmitter

Реализует паттерн "Наблюдатель", позволяя подписываться на события и уведомлять подписчиков. Методы:

on: подписка на событие.
off: отписка от события.
emit: уведомление подписчиков о событии.
onAll: подписка на все события.
offAll: сброс всех подписчиков.
trigger: генерация события с заданными аргументами для использования в других классах без прямой зависимости от EventEmitter.

Класс AppState

Управляет состоянием всего приложения (корзина, заказ, главная страница). Методы:

addProductInBasket: добавить товар в корзину.
removeProductFromBasket: удалить товар из корзины.
getBasket: получить список товаров.
setPreview: установить превью товара.
setCatalog: установить товары в каталог.
getTotalPrice: получить стоимость всех товаров из корзины.
clearBasket: очистить корзину.
setOrderField: установить значения поля заказа.
validateOrder: валидация полей заказа.
clearOrder: очистить поля заказа.
Компоненты представления

Класс Basket

Наследуется от абстрактного класса Component. Отображает корзину в контейнере. Конструктор принимает HTMLElement (шаблон корзины) и EventEmitter.

Свойства:
items: список товаров в корзине.
total: общая стоимость товаров в корзине.

Класс Modal

Наследуется от абстрактного класса Component. Отображает модальное окно. Конструктор принимает HTMLElement (контент модального окна) и EventEmitter.

Свойства и методы:
content: компонент, отображаемый в модальном окне.
open(): открыть модальное окно.
close(): закрыть модальное окно.
render(): отобразить модальное окно в компоненте.

Класс Page

Наследуется от абстрактного класса Component. Отображает главную страницу приложения. Конструктор принимает HTMLElement (body) и EventEmitter.

Свойства и методы:
counter: счетчик товаров в корзине.
catalog: каталог с карточками товаров.
locked: состояние блокировки прокрутки страницы.

Класс Product

Абстрактный класс, наследуемый от абстрактного класса Component. Шаблон продукта для управления и отображения. Конструктор принимает имя стиля компонента, контейнер шаблона (HTMLElement) и функции действия при нажатии кнопки.

Свойства:
id: уникальный идентификатор продукта.
title: название продукта.
category: категория продукта.
price: цена продукта.
image: ссылка на изображение продукта.
description: описание продукта.

Класс BasketItem

Наследуется от Product для отображения товаров в корзине. Ключевой метод index — для нумерации продуктов в корзине. Конструктор принимает имя стиля компонента, контейнер шаблона (HTMLElement) и функции действия при нажатии кнопки.

Класс Order

Наследуется от абстрактного класса Form. Отображает заказ в контейнере и управляет им. Конструктор принимает HTMLElement (шаблон страницы заказа) и функции действия на кнопку. Реагирует на изменение кнопок со стилем button_alt.

Свойства и методы:
phone: номер телефона заказчика.
email: электронная почта заказчика.
address: физический адрес заказчика.
payment: выбранный способ оплаты.

Класс Success

Наследуется от абстрактного класса Component. Отображает результат выполнения заказа. Конструктор принимает HTMLElement (шаблон окна результата) и функции действия кнопки.

Свойства:
title: заголовок окна.
description: описание результата.

Класс Form

Абстрактный класс, наследуемый от Component для создания формы, её отображения и управления. Конструктор принимает HTMLFormElement и EventEmitter.

Свойства и методы:
valid: переключатель доступности кнопки submit.
errors: ошибки валидации формы.
render(): отображение формы в контейнере.
onInputChange(): реакция на изменение инпутов формы.

описание интерфейсов и типов

export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IEvents {
	on<T extends object>(event: EventName, callback: (data: T) => void): void;
	emit<T extends object>(event: string, data?: T): void;
	trigger<T extends object>(
		event: string,
		context?: Partial<T>
	): (data: T) => void;
}

interface IBasketView {
  items: HTMLElement[];
  total: number;
}
interface IFormState {
  valid: boolean;
  errors: string[];
}
interface IModalData {
	content: HTMLElement;
}
interface IPage {
  counter: number;
  catalog: HTMLElement[];
  locked: boolean;
}
export interface IProduct<T> {
	index: number;
	title: string;
	description: string;
	price: string;
	image: string;
	category: string;
	status: T;
}
interface ISuccess {
	title: string;
	description: string;
}
export interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  status: boolean;
}
export type CatalogChangeEvent = {
  catalog: IProduct[];
};
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IOrderResult {
	id: string[];
	total: number;
	error?: string;
}

export interface IProduct {
	id: string;
	title: string;
	image: string;
	price: number | null;
	description: string;
	category: string;
}

export interface IProducts {
	total: number;
	items: IProduct[];
}

export interface IOrder {
	payment: string;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
}

export interface IWebLakerApi {
	getProducts: () => Promise<IProducts>;
	getProduct: (id: string) => Promise<IProduct>;
	createOrder: (order: IOrder) => Promise<IOrderResult>;
}