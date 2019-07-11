/* eslint no-param-reassign:0 */
const DocumentStore = {
  namespaced: true,
  state: {
    documentUploadProgress: 0,
    isDocumentUploading: false
  },
  mutations: {
    setDocumentUploadProgress(state, uploadProgress) {
      state.documentUploadProgress = uploadProgress;
    },
    setDocumentUploading(state, isUploading) {
      state.isDocumentUploading = isUploading;
    }
  },
  getters: {
    documentUploadProgress: state => state.documentUploadProgress,
    isDocumentUploading: state => state.isDocumentUploading
  }
};

export default DocumentStore;
