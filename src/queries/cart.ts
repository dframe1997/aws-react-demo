import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";

const createToken = (user: string, pass: string) => {
  return btoa(`${user}:${pass}`);
};

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const res = await axios.get<CartItem[]>(`${API_PATHS.cart}/profile/cart`, {
      headers: {
        Authorization: `Basic ${createToken(
          "38378005-dc71-4b47-8b06-646cc40710b8",
          "TEST_PASSWORD"
        )}`,
      },
    });
    console.log(res);
    return res.data;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<CartItem[]>(`${API_PATHS.cart}/profile/cart`, values, {
      headers: {
        Authorization: `Basic ${createToken(
          "38378005-dc71-4b47-8b06-646cc40710b8",
          "TEST_PASSWORD"
        )}`,
      },
    })
  );
}
