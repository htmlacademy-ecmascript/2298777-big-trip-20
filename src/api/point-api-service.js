import ApiService from '../framework/api-service';
import { ApiMethods } from '../consts';

const URL = 'points';

export default class PointApiService extends ApiService {

  get points () {
    return this._load({ url: URL }).then(ApiService.parseResponse);
  }

  async updatePoint (point) {
    const response = await this._load({
      url: `${URL}/${point.id}`,
      method: ApiMethods.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async createPoint (point) {
    const response = await this._load({
      url: URL,
      method: ApiMethods.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  async deletePoint (point) {
    const response = await this._load({
      url: `${URL}/${point.id}`,
      method: ApiMethods.DELETE,
    });

    return response;
  }

  #adaptToServer (point) {
    const adaptedPoint = {
      ...point,
      'base_price': point.basePrice,
      'date_from': point.dateFrom.toISOString(),
      'date_to': point.dateTo.toISOString(),
      'is_favorite': point.isFavorite,
    };

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
