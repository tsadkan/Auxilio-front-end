import { API_ROOT } from './index';
import Request from './request';

const PATH = '/Overviews';

const OverviewAPI = {
  all() {
    return Request.get(`${API_ROOT}${PATH}/list`);
  },
};

export default OverviewAPI;
