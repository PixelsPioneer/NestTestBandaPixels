export const backendUrl = process.env.REACT_APP_API_BASE_URL;

export const apiEndpoints = {
  products: `${backendUrl}/product`,
  productDelete: (id: string) => `${backendUrl}/product/${id}`,
};

export enum Themes {
  DARK = 'dark',
  LIGHT = 'light',
}
