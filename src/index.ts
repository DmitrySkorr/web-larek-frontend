// Импорт стилей
import './scss/styles.scss';

// Импорт модулей и констант
import WebLarekApi from './common/WebApi';
import { API_URL, CDN_URL } from './utils/constants';
import { IOrder } from './types';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { AppState, CatalogChangeEvent, IProduct } from './common/WebApplicationData';
import { Page } from './common/PageChecked';
import { Modal } from './common/Modal';
import { Basket } from './common/Basket';
import { Order } from './common/OrderChecked';
import EventEmitter from './components/base/events';
import { BasketItem, CatalogItem } from './common/ProductChecked';
import { Success } from './common/Success';

// Создание экземпляра API
const api = new WebLarekApi(API_URL);

// Логирование всех событий
EventEmitter.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Шаблоны
const templates = {
	success: ensureElement<HTMLTemplateElement>('#success'),
	catalogCard: ensureElement<HTMLTemplateElement>('#card-catalog'),
	previewCard: ensureElement<HTMLTemplateElement>('#card-preview'),
	basketCard: ensureElement<HTMLTemplateElement>('#card-basket'),
	basket: ensureElement<HTMLTemplateElement>('#basket'),
	order: ensureElement<HTMLTemplateElement>('#order'),
	contacts: ensureElement<HTMLTemplateElement>('#contacts'),
};

// Глобальные объекты
const appData = new AppState({}, EventEmitter);
const page = new Page(document.body, EventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), EventEmitter);
const basket = new Basket(cloneTemplate(templates.basket), EventEmitter);
let order: Order = null;

// Обработка изменений каталога
EventEmitter.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const product = new CatalogItem(cloneTemplate(templates.catalogCard), {
			onClick: () => EventEmitter.emit( 'product:open-preview', item),
		});
		return product.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price !== null ? `${item.price} синапсов` : '',
			category: item.category,
		});
	});
	page.counter = appData.getBusket().length;
});

// Обработка открытия превью товара
EventEmitter.on('product:open-preview', (item: IProduct) => {
	appData.setPreview(item);
});

// Обработка изменения открытого товара
EventEmitter.on('product:changed-preview', (item: IProduct) => {
	const card = new CatalogItem(cloneTemplate(templates.previewCard), {
		onClick: () => EventEmitter.emit('cart:add-product', item),
	});
	modal.render({
		content: card.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			category: item.category,
			price: item.price !== null ? `${item.price} синапсов` : '',
			status: {
				status: item.price === null || appData.basket.includes(item.id),
			},
		}),
	});
});

// Обработка корзины
EventEmitter.on('cart:add-product', (item: IProduct) => {
	appData.addProductInBasket(item);
	modal.close();
});

EventEmitter.on('cart:open', () => {
	const items = appData.getBusket().map((item, index) => {
		const product = new BasketItem(cloneTemplate(templates.basketCard), {
			onClick: () => EventEmitter.emit('cart:remove-product', item),
		});
		return product.render({
			index: index + 1,
			title: item.title,
			description: item.description,
			price: item.price?.toString() || '0',
			category: item.category,
		});
	});
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				items,
				total: appData.getTotalPrice(),
			}),
		]),
	});
});

EventEmitter.on('cart:remove-product', (item: IProduct) => {
	appData.removeProductFromBasket(item);
});

// Обработка отправки формы заказа
EventEmitter.on(/(^order|^contacts):submit/, () => {
	if (!appData.order.email || !appData.order.address || !appData.order.phone) {
		return EventEmitter.emit('order:open');
	}
	const items = appData.getBusket();
	api.createOrder({
		...appData.order,
		items: items.map((i) => i.id),
		total: appData.getTotalPrice(),
	})
	.then((result) => {
		const success = new Success(cloneTemplate(templates.success), {
			onClick: () => {
				modal.close();
				EventEmitter.emit('clear:order');
			},
		});
		modal.render({
			content: success.render({
				title: !result.error ? 'Заказ оформлен' : 'Ошибка оформления заказа',
				description: !result.error ? `Списано ${result.total} синапсов` : result.error,
			}),
		});
	})
	.catch(console.error)
	.finally(() => {
		EventEmitter.emit( 'clear:order');
	});
});

EventEmitter.on( 'clear:order', () => {
	appData.clearBasket();
	appData.clearOrder();
});

// Обработка изменения состояния формы
EventEmitter.on('formErrors:changed', (errors: Partial<IOrder>) => {
	const { email, phone, address, payment } = errors;
	
	// Проверяем, есть ли ошибки в обязательных полях
	order.valid = !address && !email && !phone && !payment;
	
	// Преобразуем объект ошибок в массив строк
	order.errors = Object.entries(errors)
	  .filter(([_, value]) => value)
	  .map(([key, value]) => `${key}: ${value}`);
  });
  

EventEmitter.on(/(^order|^contacts)\..*:change/, ({ field, value }: { field: keyof Omit<IOrder, 'items' | 'total'>; value: string }) => {
	appData.setOrderField(field, value);
});

// Обработка открытия формы заказа
EventEmitter.on('order:open', () => {
	order = null;
	const step = !appData.order.address && !appData.order.payment ? 0 : 1;
	order = new Order(cloneTemplate(!step ? templates.order : templates.contacts), EventEmitter);
	const data = !step ? { address: '' } : { phone: '', email: '' };
	modal.render({
		content: order.render({
			...data,
			valid: false,
			errors: [],
		}),
	});
});

EventEmitter.on('order:setPaymentType', (data: { paymentType: string }) => {
	appData.setOrderField('payment', data.paymentType);
});

// Обработка состояния модалки
EventEmitter.on('modal:open', () => {
	page.locked = true;
});

EventEmitter.on('modal:close', () => {
	page.locked = false;
	appData.clearOrder();
});

// Загрузка товаров с сервера
api.getProducts()
	.then(appData.setCatalog.bind(appData))
	.catch(console.error);
