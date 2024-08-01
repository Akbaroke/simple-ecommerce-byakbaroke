import { ProductSliceModel } from '@/interfaces/redux-model';
import axios from 'axios';

export const getCart = async (token: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/cart',
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

export const saveCart = async (token: string, values: ProductSliceModel[]) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/cart',
      {
        items: values.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
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

export const saveDeleteCart = async (token: string, id: string) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/cart/' + id,
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

export const saveDeleteAllCart = async (token: string) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/cart',
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
