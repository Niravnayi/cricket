import Image from "next/image";
import login from "../../../../public/lords.jpg"; // Replace with the correct path to your image
import SignUpForm from "@/components/SignUp";

export default function SignUpPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center bg-black justify-center">
      {/* Background Image */}
      <Image
        src={login}
        alt="Background Image"
        layout="fill"   
        objectFit="cover"
        className="absolute inset-0 z-0 opacity-50 dark:brightness-[0.2] dark:grayscale"
      />

      {/* Form Content */}
      <div className="relative z-10 max-w-md w-full bg-white  shadow-md rounded-md">
        <SignUpForm />
      </div>
    </div>
  );
}
