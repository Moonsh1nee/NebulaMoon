import { Field } from "@/types/field";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fieldsApi = createApi({
  reducerPath: "fieldsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  tagTypes: ["Field"],
  endpoints: (builder) => ({
    getFields: builder.query<Field[], void>({
      query: () => "/fields",
      providesTags: ["Field"],
    }),
    createField: builder.mutation<Field, Partial<Field>>({
      query: (field) => ({
        url: "/fields",
        method: "POST",
        body: field,
      }),
      invalidatesTags: ["Field"],
    }),
  }),
})

export const {
  useGetFieldsQuery,
  useCreateFieldMutation,
} = fieldsApi;