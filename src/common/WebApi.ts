import { Api } from '../components/base/api';
import { IWebLakerApi, IProducts, IOrderResult, IProduct, IOrder } from '../types/index';

export default class WebLarekApi extends Api implements IWebLakerApi {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
  }

  // Получить список продуктов
  getProducts(): Promise<IProducts> {
    return this.get('/product/').then(response => response as IProducts);
  }

  // Получить продукт по ID
  getProduct(id: string): Promise<IProduct> {
    return this.get(`/product/${id}`).then(response => response as IProduct);
  }

  // Создать заказ
  createOrder(order: IOrder): Promise<IOrderResult> {
    return this.post('/order', order).then(response => response as IOrderResult);
  }
}
