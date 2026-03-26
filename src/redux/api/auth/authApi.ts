import baseApi from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // sign up
    signUp: builder.mutation({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    //verify otp
    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // recend otp 
    resendCode: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"]
    }),

    //login
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    //forget password
    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // /auth/verify-forgot-password-otp
    verifyForgetPasswordOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // resend otp for forget password
    resendForgetPasswordVeirifyOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp/forgot-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // reset password 
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // google login 
    googleSignIn: builder.mutation({
      query: (body) => ({
        url: "/auth/google",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    //log out
    logout: builder.mutation({
      query: (payload) => ({
        url: "/auth/logout",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

    // update profile
    updateProfile: builder.mutation({
      query: (bodyData) => ({
        url: "/users/profile",
        method: "PATCH",
        body: bodyData,
      }),
      invalidatesTags: ["User"],
    }),

    // change password
    changePassword: builder.mutation({
      query: (payload) => ({
        url: "/auth/change-password",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useVerifyEmailMutation,
  useResendCodeMutation,
  useForgetPasswordMutation,
  useVerifyForgetPasswordOtpMutation,
  useResendForgetPasswordVeirifyOtpMutation,
  useResetPasswordMutation,
  useGoogleSignInMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
