/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'universal-cookie';

// const baseURL = process.env.NEXT_PUBLIC_API_URL
const baseURL = ""
const cookies = new Cookies();

const axiosInstance = axios.create({
  baseURL,
});

export const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      withToken?: boolean;
      isFormData?: boolean;
    },
    unknown,
    unknown
  > =>
  async ({ url, method, data, params, withToken, isFormData }, { signal }) => {
    try {
      const headers: any = {};

      if (withToken) {
        const token = cookies.get('accessToken');
        if (token) headers['Authorization'] = `Bearer ${token}`;
      }

      if (!isFormData) headers['Content-Type'] = 'application/json';

      const response = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
        signal, 
      });

      return { data: response.data };
    } catch (err) {
      const error = err as AxiosError;
      
      if (error.code === 'ERR_CANCELED' || error.name === 'CanceledError') {
        return {
          error: {
            status: 'CANCELLED',
            data: 'Request was cancelled',
          },
        };
      }

      return {
        error: {
          status: error.response?.status,
          data: error.response?.data || error.message,
        },
      };
    }
  };