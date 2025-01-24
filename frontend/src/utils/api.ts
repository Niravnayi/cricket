import axiosClient from './axiosClient';

interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

interface ErrorResponse {
  response?: {
    data: {
      error: string;
    };
  };
  request?: unknown;
  message: string;
}

export const login = async (email: string, password: string, role: string): Promise<LoginResponse> => {
  try {
    const response = await axiosClient.post<LoginResponse>(
      '/signin',
      { email, password, role },
      { withCredentials: true }
    );

    return response.data;
  } 
  catch (error) {
    const typedError = error as ErrorResponse;

    if (typedError.response) {
      throw new Error(typedError.response.data.error || 'Something went wrong');
    } 
    else if (typedError.request) {
      throw new Error('No response from the server');
    } 
    else {
      throw new Error(typedError.message || 'An error occurred');
    }
  }
};

