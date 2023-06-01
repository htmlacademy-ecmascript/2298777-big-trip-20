import ApiService from '../framework/api-service';

const URL = 'destinations';

export default class DestinationApiService extends ApiService {
  get destinations () {
    return this._load({ url: URL }).then(ApiService.parseResponse);
  }
}
