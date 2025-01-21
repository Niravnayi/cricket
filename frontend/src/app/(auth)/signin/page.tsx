"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSession } from "next-auth/react";

interface IFormInput {
  email: string;
  password: string;
  role: string;
}

export default function SignIn() {
  const router = useRouter();
  const session = useSession();
  const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();

  const [error, setError] = useState("");

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const result = await signIn("Credentials", {
      email: data.email,
      password: data.password,
      role: data.role,
      callbackUrl: "/tournament",
      redirect: false,
    });
    if (result?.error) {
        setError(result.error);
    }
};
if (session.data?.user?.role==='user'){
    router.push('/tournament')
}

  const handleGmailLogin = () => {
    signIn("google");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          <div>
            <label htmlFor="email" className="block text-sm font-semibold">
              Email
            </label>
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
              className={`w-full px-4 py-2 mt-1 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register("password", { 
                required: "Password is required", 
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters"
                }
              })}
              className={`w-full px-4 py-2 mt-1 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-semibold">
              Role
            </label>
            <select
              id="role"
              {...register("role", { required: "Role is required" })}
              className={`w-full px-4 py-2 mt-1 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
            {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Sign In
          </button>
        </form>

        <div className="my-4 text-center">
          <span className="text-sm text-gray-500">Or</span>
        </div>

        <button
          onClick={handleGmailLogin}
          className="w-full py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Sign In with Gmail
        </button>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-indigo-600 hover:underline">
              Please sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}