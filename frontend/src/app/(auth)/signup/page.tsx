'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import  { AxiosResponse } from 'axios';
import axiosClient from '@/utils/axiosClient';

interface IFormInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface ISignUpResponse {
  token: string;
  user: {
    id: string;
    role: string;
  };
}

const SignUp = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {
      const result: AxiosResponse<ISignUpResponse> = await axiosClient.post('/signup', {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // Check if result.data and result.data.user exist
      if (result.data && result.data.user) {
        router.push('/signin');
      } else {
        setError('Unexpected response structure');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Name Input */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            {...register("name", { required: "Name is required" })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address"
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type={passwordVisible ? "text" : "password"}
            id="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {/* Password visibility toggle */}
          <button
            type="button"
            onClick={() => setPasswordVisible(!passwordVisible)}
            className="absolute top-1/2 right-4 transform focus:outline-none"
          >
            {passwordVisible ? (
              <HiEyeOff className="text-gray-500 w-5 h-5" />
            ) : (
              <HiEye className="text-gray-500 w-5 h-5" />
            )}
          </button>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        {/* Role Selection */}
        <div className="mb-4">
          <label htmlFor="role" className="block text-gray-700">Role</label>
          <select
            id="role"
            {...register("role", { required: "Role is required" })}
            className={`w-full px-4 py-2 border rounded-lg ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Sign Up
        </button>

        {/* Sign In Link */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-500 hover:underline">Sign in</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

