import { Model } from '../base/Model';
import { FormErrors, IOrder } from '../../types/index';

// Интерфейс продукта
export interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
  category: string;
  status: boolean;
}

// Тип для события изменения каталога
export type CatalogChangeEvent = {
  catalog: IProduct[];
};

// Состояние приложения
export class AppState extends Model<AppState> {
  basket: string[] = [];
  catalog: IProduct[] = [];
  preview: string | null = null;
  formErrors: FormErrors = {};
  order: IOrder = {
    email: '',
    phone: '',
    payment: null,
    address: '',
    total: 0,
    items: [],
  };

  // Добавление продукта в корзину
  addProductInBasket(item: IProduct) {
    if (!this.basket.includes(item.id)) {
      this.basket.push(item.id);
      this.emitChanges('items:changed', { catalog: this.catalog });
    }
  }

  // Удаление продукта из корзины
  removeProductFromBasket(item: IProduct) {
    const index = this.basket.indexOf(item.id);
    if (index > -1) {
      this.basket.splice(index, 1);
      this.emitChanges('cart:open', { catalog: this.catalog });
      this.emitChanges('items:changed', { catalog: this.catalog });
    }
  }

  // Получение продуктов в корзине
  getBusket() {
    return this.catalog.filter(item => this.basket.includes(item.id));
  }

  // Установка превью продукта
  setPreview(item: IProduct) {
    this.preview = item.id;
    this.emitChanges('product:changed-preview', item);
  }

  // Установка каталога
  setCatalog(data: { items: IProduct[]; total: number }) {
    this.catalog = data.items;
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // Общая стоимость корзины
  getTotalPrice() {
    return this.basket.reduce(
      (total, id) => total + this.catalog.find(item => item.id === id).price, 0
    
    );
  }

  // Очистка корзины
  clearBasket() {
    this.basket = [];
    this.emitChanges('items:changed', { catalog: this.catalog });
  }

  // Установка поля заказа
  setOrderField(field: keyof Omit<IOrder, 'items' | 'total'>, value: string) {
    this.order[field] = value;
    if (this.validateOrder(field)) {
      this.events.emit('order:ready', this.order);
    }
  }

  // Валидация заказа
  validateOrder(field: keyof IOrder) {
    const errors: FormErrors = {};

    if (!['address', 'payment'].includes(field as string)) {
      if (!this.order.email) errors.email = 'Необходимо указать email';
      if (!this.order.phone) errors.phone = 'Необходимо указать телефон';
    } else {
      if (!this.order.address) errors.address = 'Необходимо указать адрес';
      if (!this.order.payment) errors.payment = 'Необходимо выбрать тип оплаты';
    }

    this.formErrors = errors;
    this.events.emit('formErrors:changed', this.formErrors);
    return Object.keys(errors).length === 0;
  }

  // Очистка заказа
  clearOrder() {
    this.order = {
      email: '',
      phone: '',
      payment: null,
      address: '',
      total: 0,
      items: [],
    };
  }
}
