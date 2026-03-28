
import baseApi from "../baseApi";

export const homeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //  user dashboard stats 
        getUserDashboardStats: builder.query({
            query: () => ({
                url: "/dashboard/user/stats",
                method: "GET",
            }),
        }),
    }),
});

export const { useGetUserDashboardStatsQuery } = homeApi;
