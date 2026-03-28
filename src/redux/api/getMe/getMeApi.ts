
import baseApi from "../baseApi";

export const getMe = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // need to add types
    getMe: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    // get all notifications 
    getAllNotifications: builder.query({
      query: () => ({
        url: "/notifications",
        method: "GET",
      }),
      providesTags: ["Notification"],
    }),

    // read single Notification 
    // readNotification: builder.query({
    //   query: (id) => ({
    //     url: `/notifications/${id}`,
    //     method: "GET",
    //   }),
    //   providesTags: ["Notification"],
    // }),

    readNotification: builder.mutation({
      query: (id) => ({
        url: `/notifications/${id}/read`,
        method: "PATCH",
      }),
      invalidatesTags: ["Notification"],
    }),

  }),
});

export const {
  useGetMeQuery,
  useGetAllNotificationsQuery,
  // useReadNotificationQuery,
  useReadNotificationMutation
} = getMe;
