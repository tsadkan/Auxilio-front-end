import { API_ROOT } from './index';
import Request from './request';

const PATH = '/GenericDocuments';

const GenericDocumentAPI = {
  all(limit, skip, order, filter) {
    return Request.get(`${API_ROOT}${PATH}/list`);
  },
  uploadFiles(data, store) {
    return Request.post(`${API_ROOT}${PATH}/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: e => {
        const progress = Math.round((e.loaded * 100) / e.total);
        store.commit('DocumentStore/setDocumentUploadProgress', progress);
      }
    });
  }
};

export default GenericDocumentAPI;
