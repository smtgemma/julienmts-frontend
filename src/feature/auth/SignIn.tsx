
// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";
// import AuthBackground from "@/components/shared/AuthBackground/AuthBackground";
// import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
// import { useGoogleSignInMutation, useSignInMutation } from "@/redux/api/auth/authApi";
// import { setUser } from "@/redux/features/user/userSlice";
// import CustomInput from "@/ui/CustomeInput";
// import { zodResolver } from "@hookform/resolvers/zod";
// import Cookies from "js-cookie";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { useDispatch } from "react-redux";
// import { toast } from "sonner";
// import * as z from "zod";
// import { GoogleLogin } from "@react-oauth/google";
// import { jwtDecode } from "jwt-decode";

// // Define Zod schema for validation
// const formSchema = z.object({
//   email: z
//     .string()
//     .email({ message: "Please enter a valid email address" })
//     .min(1, { message: "Email is required" }),
//   password: z
//     .string()
//     .min(6, { message: "Password should be at least 6 characters long" })
//     .min(1, { message: "Password is required" }),
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function SignInPage() {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   // Use React Hook Form with Zod resolver
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormValues>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const [signIn, { isLoading }] = useSignInMutation();
//   const [googleSignIn] = useGoogleSignInMutation();

//   // const domain = window.location.origin;
//   // console.log(domain, "=================domin===============")

//   const onSubmit = async (data: FormValues) => {
//     try {
//       const response = await signIn(data).unwrap();
//       if (response?.success) {
//         // console.log(response, "===============================")
//         Cookies.set("token", response.data.accessToken);
//         Cookies.set("refreshToken", response.data.refreshToken);
//         Cookies.set("token", response.data.accessToken, {
//           domain: ".aiteamtwo.com",
//           secure: true,
//           sameSite: "None",
//         });

//         Cookies.set("refreshToken", response.data.refreshToken, {
//           domain: ".aiteamtwo.com",
//           secure: true,
//           sameSite: "None",
//         });
//         dispatch(
//           setUser({
//             token: response.data.accessToken,
//             refreshToken: response.data.refreshToken,
//             user: response?.data?.user,
//           })
//         );
//         toast.success("Login successful");
//         console.log("Login successful", response?.data?.user?.role);
//         if (
//           response?.data?.user?.role === "ADMIN" ||
//           response?.data?.user?.role === "SUPER_ADMIN"
//         ) {
//           router.push("http://localhost:3055");
//           // router.push("http://206.162.244.131:3055/");
//           // router.push("http://206.162.244.134:3055/");
//           // router.push("https://admin-julientmts.aiteamtwo.com");
//         } else {
//           router.push("http://localhost:3054/dashboard/home");
//           // router.push("http://206.162.244.131:3054/dashboard/home");
//           // router.push("http://206.162.244.134:3054/dashboard/home");
//           // router.push("https://julientmts.aiteamtwo.com/dashboard/home");
//         }
//       }
//     } catch (error: any) {
//       console.log("Error during sign-in:", error);
//       return toast.error(error?.data?.message || "Login failed");
//     }
//   };

//   // google login working for functonalti
//   const handleSuccess = async (credentialResponse: any) => {
//     // console.log("yesTonek= ", credentialResponse);
//     try {
//       const idToken = {
//         idToken: credentialResponse.credential,
//       };

//       const response = await googleSignIn(idToken).unwrap();
//       // console.log("response", response);

//       if (response?.success) {
//         // localStorage.setItem("accessToken", response?.data?.accessToken);
//         // Cookies.set("accessToken", response?.data?.accessToken);
//         // const decoded = jwtDecode(response?.data?.accessToken);

//         // const email = decoded.email;
//         // console.log("Google Email:", email);

//         // console.log(response?.data?.userData?.role);

//         dispatch(
//           setUser({
//             token: response.data.accessToken,
//           }),
//         );
//         toast.success(response?.message);
//         router.push("/dashboard/home");
//         // if (response?.data?.teeRegistration === null) {
//         //   router.push(`/role?email=${email}`);
//         // } else {
//         //   router.push("/new-project");
//         // }
//       }

//       console.log("Login successful", response.data);
//       // Handle successful login (store tokens, redirect, etc.)
//     } catch (error) {
//       console.error("Login failed", error);
//     }
//   };
//   const handleError = () => {
//     console.log("Login Failed");
//   };

//   return (
//     <AuthBackground>
//       <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-6 rounded-2xl">
//         <h3 className="font-bold text-3xl mb-6 text-[#2D2D2D]">Sign in to your account</h3>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
//           {/* Email Input */}
//           <CustomInput
//             id="email"
//             type="email"
//             label="Email"
//             placeholder="Enter your email"
//             leftIcon={<img src="/authImage/mailIcon.png" alt="icon" className="w-5 h-5" />}
//             {...register("email")}
//             error={errors.email?.message}
//           />

//           {/* Password Input */}
//           <CustomInput
//             id="password"
//             type="password"
//             label="Password"
//             placeholder="Enter your password"
//             showPasswordToggle={true}
//             error={errors.password?.message}
//             leftIcon={<img src="/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
//             {...register("password")}
//           />

//           {/* Remember Me and Forgot Password */}
//           <div className="text-right">
//             <Link
//               href="/forget-password"
//               className="text-sm text-[#000000] font-semibold text-[16px] hover:underline"
//             >
//               Forgot your password?
//             </Link>
//           </div>
//           {/* Login Button */}
//           <PrimaryButton type="submit" loading={isLoading} text="Sign In" />
//         </form>
//         <div className="text-center mb-3 mt-3 text-[16px] text-gray-600">
//           Don’t have an account?{" "}
//           <Link href="/signUp" className="text-[#00695C] text-[16px] font-semibold hover:underline">
//             Sign up
//           </Link>
//           <div className="flex items-center gap-4 w-[80%] mx-auto my-3">
//             <div className="flex-1 h-[1px] bg-[#D1D6DB]" />
//             <span className="text-[16px] text-authBackgroundButton">or</span>
//             <div className="flex-1 h-[1px] bg-[#D1D6DB]" />
//           </div>
//           {/* <button
//             className="w-full flex items-center justify-center gap-3 border border-[#D1D6DB] rounded-md py-2.5 transition"
//           >
//             <img
//               src="/authImage/googleIcon.png"
//               alt="google icon"
//               className="w-5 h-5"
//             />
//             <span className="text-[#2D2D2D] font-medium text-[16px]">Sign in with Google</span>
//           </button> */}
//           <div>
//             <GoogleLogin
//               size="large"
//               onSuccess={handleSuccess}
//               onError={handleError}
//             />
//           </div>

//         </div>
//       </div>
//     </AuthBackground>
//   );
// }




/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AuthBackground from "@/components/shared/AuthBackground/AuthBackground";
import PrimaryButton from "@/components/shared/primaryButton/PrimaryButton";
import { useGoogleSignInMutation, useSignInMutation } from "@/redux/api/auth/authApi";
import { setUser } from "@/redux/features/user/userSlice";
import CustomInput from "@/ui/CustomeInput";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import * as z from "zod";
import { GoogleLogin } from "@react-oauth/google";

// Define Zod schema for validation
const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password should be at least 6 characters long" })
    .min(1, { message: "Password is required" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignInPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  // Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [signIn, { isLoading }] = useSignInMutation();
  const [googleSignIn] = useGoogleSignInMutation();

  // const domain = window.location.origin;
  // console.log(domain, "=================domin===============")

  const onSubmit = async (data: FormValues) => {
    try {
      const response = await signIn(data).unwrap();
      if (response?.success) {
        // console.log(response, "===============================")
        Cookies.set("token", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);
        // Cookies.set("token", response.data.accessToken, {
        //   domain: ".aiteamtwo.com",
        //   secure: true,
        //   sameSite: "None",
        // });

        // Cookies.set("refreshToken", response.data.refreshToken, {
        //   domain: ".aiteamtwo.com",
        //   secure: true,
        //   sameSite: "None",
        // });
        dispatch(
          setUser({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: response?.data?.user,
          })
        );
        toast.success("Login successful");
        console.log("Login successful", response?.data?.user?.role);
        // if (
        //   response?.data?.user?.role === "ADMIN" ||
        //   response?.data?.user?.role === "SUPER_ADMIN"
        // ) {
        //   router.push("http://localhost:3055");
        //   // router.push("http://206.162.244.131:3055/");
        //   // router.push("http://206.162.244.134:3055/");
        //   // router.push("https://admin-julientmts.aiteamtwo.com");
        // } else {
        //   router.push("http://localhost:3054/dashboard/home");
        //   // router.push("http://206.162.244.131:3054/dashboard/home");
        //   // router.push("http://206.162.244.134:3054/dashboard/home");
        //   // router.push("https://julientmts.aiteamtwo.com/dashboard/home");
        // }

        if (response?.data?.user?.role === "USER") {
          router.push("/dashboard/home");
        }
      }
    } catch (error: any) {
      console.log("Error during sign-in:", error);
      return toast.error(error?.data?.message || "Login failed");
    }
  };


  // google login working for functonalti
  const handleSuccess = async (credentialResponse: any) => {
    // console.log("yesTonek= ", credentialResponse);
    try {
      const idToken = {
        idToken: credentialResponse.credential,
      };

      const response = await googleSignIn(idToken).unwrap();
      // console.log("response", response);

      if (response?.success) {
        Cookies.set("token", response.data.accessToken);
        Cookies.set("refreshToken", response.data.refreshToken);
        // Cookies.set("token", response.data.accessToken, {
        //   domain: ".aiteamtwo.com",
        //   secure: true,
        //   sameSite: "None",
        // });

        // Cookies.set("refreshToken", response.data.refreshToken, {
        //   domain: ".aiteamtwo.com",
        //   secure: true,
        //   sameSite: "None",
        // });
        dispatch(
          setUser({
            token: response.data.accessToken,
            refreshToken: response.data.refreshToken,
            user: response?.data?.user,
          })
        );

        dispatch(
          setUser({
            token: response.data.accessToken,
          }),
        );
        toast.success(response?.message);
        if (response?.data?.user?.role === "USER") {
          // router.push("http://localhost:3054/dashboard/home");
          // router.push("https://julientmts.aiteamtwo.com/dashboard/home");
          router.push("/dashboard/home");
        }
      }

      console.log("Login successful", response.data);
      // Handle successful login (store tokens, redirect, etc.)
    } catch (error) {
      console.error("Login failed", error);
    }
  };
  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <AuthBackground>
      <div className="max-w-[540px] lg:w-[540px] h-auto mx-auto bg-[#FFF] p-6 rounded-2xl">
        <h3 className="font-bold text-3xl mb-6 text-[#2D2D2D]">Sign in to your account</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          {/* Email Input */}
          <CustomInput
            id="email"
            type="email"
            label="Email"
            placeholder="Enter your email"
            leftIcon={<img src="/authImage/mailIcon.png" alt="icon" className="w-5 h-5" />}
            {...register("email")}
            error={errors.email?.message}
          />

          {/* Password Input */}
          <CustomInput
            id="password"
            type="password"
            label="Password"
            placeholder="Enter your password"
            showPasswordToggle={true}
            error={errors.password?.message}
            leftIcon={<img src="/authImage/passwordIcon.png" alt="icon" className="w-5 h-5" />}
            {...register("password")}
          />

          {/* Remember Me and Forgot Password */}
          <div className="text-right">
            <Link
              href="/forget-password"
              className="text-sm text-[#000000] font-semibold text-[16px] hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
          {/* Login Button */}
          <PrimaryButton type="submit" loading={isLoading} text="Sign In" />
        </form>
        <div className="text-center mb-3 mt-3 text-[16px] text-gray-600">
          Don’t have an account?{" "}
          <Link href="/signUp" className="text-[#00695C] text-[16px] font-semibold hover:underline">
            Sign up
          </Link>
          <div className="flex items-center gap-4 w-[80%] mx-auto my-3">
            <div className="flex-1 h-[1px] bg-[#D1D6DB]" />
            <span className="text-[16px] text-authBackgroundButton">or</span>
            <div className="flex-1 h-[1px] bg-[#D1D6DB]" />
          </div>
          <div className="flex justify-center items-center">
            <GoogleLogin
              size="large"
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>

        </div>
      </div>
    </AuthBackground>
  );
}

