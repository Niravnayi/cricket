import axiosClient from './axiosClient';

export const login = async (email: string, password: string, role: string) => {
  try {
    const response = await axiosClient.post('/signin', { email, password, role }, { withCredentials: true });

    return response.data; 
  } 
  catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Something went wrong');
    } 
    else if (error.request) {
      throw new Error('No response from the server');
    } 
    else {
      throw new Error(error.message || 'An error occurred');
    }
  }
};
