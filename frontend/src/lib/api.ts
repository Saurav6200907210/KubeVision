import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api', // Hardcoded for local dev, should be env var
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
