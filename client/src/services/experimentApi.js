const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Lấy danh sách tóm tắt các bài thí nghiệm
 * @returns {Promise<Array>}
 */
export async function getExperiments() {
  return fetchJson(`${BASE_URL}/experiments`);
}

/**
 * Lấy chi tiết toàn bộ kịch bản của một bài thí nghiệm
 * @param {string} id
 * @returns {Promise<Object>}
 */
export async function getExperimentById(id) {
  return fetchJson(`${BASE_URL}/experiments/${id}`);
}
