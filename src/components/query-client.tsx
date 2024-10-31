"use client";
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const queryClient = new QueryClient();

type QueryClientWrapperProps = {
  children: React.ReactNode;
};

const QueryClientWrapper = ({ children }: QueryClientWrapperProps) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryClientWrapper;
