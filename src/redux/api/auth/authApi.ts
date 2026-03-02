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
    }),

    // /auth/verify-forgot-password-otp
    verifyForgetPasswordOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/verify-forgot-password-otp",
        method: "POST",
        body,
      }),
    }),

    // resend otp for forget password
    resendForgetPasswordVeirifyOtp: builder.mutation({
      query: (body) => ({
        url: "/auth/resend-otp/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // reset password 
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "/auth/reset-password",
        method: "POST",
        body,
      }),
    }),
    

    googleSignIn: builder.mutation({
      query: (body) => ({
        url: "/auth/social-login",
        method: "POST",
        body,
      })
    })





    // resendCode: builder.mutation({
    //   query: (body) => ({
    //     url: "/auth/send-otp",
    //     method: "POST",
    //     body,
    //   }),
    // }),

    // logout: builder.mutation({
    //   query: () => ({
    //     url: "/auth/logout",
    //     method: "POST",
    //   }),
    // }),

    // resetPassword: builder.mutation({
    //   query: ({ userId, password }) => ({
    //     url: `/auth/reset-password`,
    //     method: "POST",
    //     body: { userId, password },
    //   }),
    // }),
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
} = authApi;
