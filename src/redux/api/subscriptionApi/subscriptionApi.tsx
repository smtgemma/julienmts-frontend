
import baseApi from "../baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // get all subscription
    getAllSubscriptions: builder.query({
      query: () => ({
        url: "/plans",
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

    // subscription 
    subscription: builder.mutation({
      query: (payload) => ({
        url: "/subscriptions",
        method: "POST",
      }),
      invalidatesTags: ["Subscripton"],
    }),

  }),
});

export const { useGetAllSubscriptionsQuery, useGetSinglePlanQuery, useSubscriptionMutation } = subscriptionApi;
