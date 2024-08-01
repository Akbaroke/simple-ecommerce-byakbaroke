import { ProductSchema } from '@/schemas';
import axios from 'axios';
import { z } from 'zod';

export const addProduct = async (
  token: string,
  values: z.infer<typeof ProductSchema>
) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/products',
      values,
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

export const getProducts = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/products'
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/products/' + id
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const updateProduct = async (
  token: string,
  values: z.infer<typeof ProductSchema>,
  id: string
) => {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/products/' + id,
      values,
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

export const getBrands = async () => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/products/brands'
    );
    return response.data;
  } catch (error) {
    return null;
  }
};

export const deleteProduct = async (token: string, id: string) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/products/' + id,
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
