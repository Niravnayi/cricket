'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { login } from '@/utils/api';
import { HiEye, HiEyeOff } from 'react-icons/hi'; 

interface IFormInput {
  email: string;
  password: string;
  role: string;
}

const SignIn = () => {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
  const [error, setError] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    try {

      await login(data.email, data.password, data.role);

      router.push('/');
    }
    catch (err: unknown) {
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
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>} 

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
          Login
        </button>

        {/* Sign Up Link */}
        <div className="mt-4 text-center">
          <span className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
          </span>
        </div>
      </form>
    </div>
  );
};

export default SignIn;

