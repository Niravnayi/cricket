import { LoginForm } from "@/components/LoginForm";
import login from "../../../../public/lords.jpg";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="relative min-h-[100vh] flex bg-black items-center justify-center">
      {/* Background Image */}
      <Image
        src={login}
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="absolute opacity-50 inset-0 z-0 dark:brightness-[0.2] dark:grayscale"
      />

      {/* Form Container */}
      <div className="relative z-10  bg-white dark:bg-black/50 p-6 md:p-10 rounded-lg shadow-lg max-w-md w-full">
        <LoginForm />
      </div>
    </div>
  );
}
