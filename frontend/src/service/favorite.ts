import { ProductModel } from '@/interfaces/product';
import axios from 'axios';

export const getFavorite = async (token: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const addSaveFavorite = async (token: string, productId: string) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites',
      {
        productId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: response.data.message };
  } catch (error) {
    return { error: (error as any).response.data.error };
  }
};

export const deleteSaveFavorite = async (token: string, productId: string) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/favorites/' + productId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return { success: response.data.message };
  } catch (error) {
    return { error: (error as any).response.data.error };
  }
};
