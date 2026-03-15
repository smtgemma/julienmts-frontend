
import baseApi from "../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // get all subscription
    getAllSubscriptions: builder.query<any, { interval: string }>({
      query: ({ interval }) => ({
        url: `/plans?interval=${interval}`,
        method: "GET",
      }),
      providesTags: ["Subscripton"],
    }),

    // get single plan
    getSinglePlan: builder.query({
      query: (id) => ({
        url: `/plans/${id}`,
        method: "GET",
      }),
      providesTags: ["Subscripton"]
    }),

    //payment method
    paymentMethod: builder.mutation({
      query: (payload) => ({
        url: "/payment_methods",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscripton"],
    }),

    // subscription 
    subscription: builder.mutation({
      query: (payload) => ({
        url: "/subscriptions",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subscripton"],
    }),

    // active subscription 
    activeSubscription: builder.query({
      query: () => ({
        url: "/subscriptions/me",
        method: "GET",
      }),
      providesTags: ["Subscripton"],
    }),

  }),
});

export const { useGetAllSubscriptionsQuery, useGetSinglePlanQuery, usePaymentMethodMutation, useSubscriptionMutation, useActiveSubscriptionQuery } = subscriptionApi;
