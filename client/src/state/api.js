import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

console.log(process.env.REACT_APP_BASE_URL);
export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:5001` }),
  reducerPath: "adminApi",
  tagTypes: [
    "User",
    "Products",
    "Customers",
    "Transactions",
    "Summary",
    "Add",
    "Geography",
    "Sales",
    "Admins",
    "Performance",
    "Dashboard",
  ],
  endpoints: (build) => ({
    getUser: build.query({
      query: (id) => `general/user/${id}`,
      providesTags: ["User"],
    }),
    getProducts: build.query({
      query: () => "client/products",
      providesTags: ["Products"],
    }),
    getCustomers: build.query({
      query: () => "client/customers",
      providesTags: ["Customers"],
    }),
    getTransactions: build.query({
      query: ({ userId, page, pageSize, sort, search }) => ({
        url: `client/transactions/${userId}`,
        method: "GET",
        params: { page, pageSize, sort, search },
      }),
      providesTags: ["Transactions"],
    }),
    getTransactionsSummary: build.query({
      query: ({ userId,type,value }) => ({
        url: `client/transactions/breakdown/${userId}`,
        method: "GET",
        params: { type,value },
      }),
      providesTags: ["Summary"],
    }),
    AddTransaction: build.mutation({
      query: ({ userId, cardId, transactionId, vendor, category, date, amount }) => ({
        url: "client/transactions/add",
        method: "POST",
        body: { userId, cardId, transactionId, vendor, category, date, amount },
      }),
      invalidatesTags: ["Add"],
    }),
 
  
    getGeography: build.query({
      query: () => "client/geography",
      providesTags: ["Geography"],
    }),
    getSales: build.query({
      query: () => "sales/sales",
      providesTags: ["Sales"],
    }),
    getAdmins: build.query({
      query: () => "management/admins",
      providesTags: ["Admins"],
    }),
    getUserPerformance: build.query({
      
      query: (id) => `management/performance/${id}`,
      providesTags: ["Performance"],
    }),
    getDashboard: build.query({
      
      query: () => "general/dashboard",
      providesTags: ["Dashboard"],
    }),
  }),
});

export const {
  useGetUserQuery,
  useGetProductsQuery,
  useGetCustomersQuery,
  useGetTransactionsQuery,
  useGetTransactionsSummaryQuery,
  useAddTransactionMutation,
  useGetGeographyQuery,
  useGetSalesQuery,
  useGetAdminsQuery,
  useGetUserPerformanceQuery,
  useGetDashboardQuery,
} = api;