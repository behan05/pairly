// when send any media data isFormData much be true to bypass Content-type application/json

export const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const headers = {
    Authorization: `Bearer ${token}`
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  return headers;
};
