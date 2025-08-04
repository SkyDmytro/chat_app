const getAuthToken = () => {
  return localStorage.getItem("jwt");
};

const removeAuthToken = () => {
  localStorage.removeItem("jwt");
};

const setAuthToken = (token: string) => {
  localStorage.setItem("jwt", token);
};

export const session = {
  getAuthToken,
  removeAuthToken,
  setAuthToken,
};
