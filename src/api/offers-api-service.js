import ApiService from '../framework/api-service';

const URL = 'offers';

export default class OffersApiService extends ApiService {
  get offers() {
    return this._load({ url: URL }).then(ApiService.parseResponse);
  }
}
