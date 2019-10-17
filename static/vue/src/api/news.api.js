import { API_ROOT } from './index';
import Request from './request';

const PATH = '/News';

const NewsAPI = {
  all() {
    return Request.get(`${API_ROOT}${PATH}/list`);
  },
};

export default NewsAPI;
