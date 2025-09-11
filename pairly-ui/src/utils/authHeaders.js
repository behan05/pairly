export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');

  return token
    ? {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    : null;
};
