import { AdminSchema } from '@/schemas';
import axios from 'axios';
import { z } from 'zod';

export const getUsers = async (token: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/admin/users',
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

export const getUserById = async (token: string, id: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/admin/users/' + id,
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

export const updateUser = async (
  token: string,
  values: z.infer<typeof AdminSchema>,
  id: string
) => {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/admin/users/' + id,
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

export const deleteUser = async (token: string, id: string) => {
  try {
    const response = await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/admin/users/' + id,
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
