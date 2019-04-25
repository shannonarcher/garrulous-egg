const axios = jest.genMockFromModule('axios');

axios.get = jest.fn(() => Promise.resolve({ data: {} }));

export default axios;
