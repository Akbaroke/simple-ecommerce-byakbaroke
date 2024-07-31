import { RegisterSchema, ProfileSchema } from '@/schemas';
import axios from 'axios';
import { z } from 'zod';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  try {
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/register',
      values
    );

    return { success: response.data.message };
  } catch (error) {
    return { error: (error as any).response.data.error };
  }
};

export const getProfile = async (token: string) => {
  try {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/users/profile',
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

export const updateProfile = async (
  token: string,
  values: z.infer<typeof ProfileSchema>
) => {
  try {
    const response = await axios.put(
      process.env.NEXT_PUBLIC_BACKEND_URL + '/users/profile',
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
