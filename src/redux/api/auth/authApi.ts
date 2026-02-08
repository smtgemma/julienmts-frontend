import baseApi from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    signUp: builder.mutation({
      query: (body) => ({
        url: "/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    
    signIn: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    forgetPassword: builder.mutation({
      query: (body) => ({
        url: "/user/send-reset-otp",
        method: "POST",
        body,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (body) => ({
        url: "/user/reset-password-otp",
        method: "POST",
        body,
      }),
    }),

    googleSignIn: builder.mutation({
      query: (body) => ({
        url:"/auth/social-login",
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
  // useLogoutMutation,
  useVerifyEmailMutation,
  // useResendCodeMutation,
  useForgetPasswordMutation,
  // useResetPasswordMutation,
  useGoogleSignInMutation,
} = authApi;
