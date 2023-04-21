import Typography from "@mui/material/Typography";
import { Product } from "~/models/Product";
import SyncIcon from "@mui/icons-material/Sync";
import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import { useCart, useInvalidateCart, useUpsertCart } from "~/queries/cart";
import { CartItem } from "~/models/CartItem";
import { useEffect, useState } from "react";

type AddProductToCartProps = {
  product: Product;
};

export default function AddProductToCart({ product }: AddProductToCartProps) {
  const { data = [], isFetching } = useCart();
  const { mutate: upsertCart } = useUpsertCart();
  const invalidateCart = useInvalidateCart();
  const [cartItem, setCartItem] = useState<CartItem | null>(null);

  useEffect(() => {
    if (!isFetching) {
      console.log("CART DATA: ", data);
      const item = data.find((i) => i.product.id === product.id);
      if (item) {
        console.log("SETTING ITEM");
        setCartItem(item);
      }
    }
  }, [isFetching]);

  const addProduct = () => {
    upsertCart(
      { product, count: cartItem ? cartItem.count + 1 : 1 },
      { onSuccess: invalidateCart }
    );
  };

  const removeProduct = () => {
    if (cartItem) {
      upsertCart(
        { ...cartItem, count: cartItem.count - 1 },
        { onSuccess: invalidateCart }
      );
    }
  };

  return isFetching ? (
    <IconButton disabled={isFetching} size="large">
      <SyncIcon color={"primary"} />
    </IconButton>
  ) : (
    <>
      <IconButton
        disabled={(cartItem && cartItem.count < 1) || !cartItem}
        onClick={removeProduct}
        size="large"
      >
        <Remove color={"secondary"} />
      </IconButton>
      <Typography align="center">{cartItem ? cartItem.count : 0}</Typography>
      <IconButton onClick={addProduct} size="large">
        <Add color={"secondary"} />
      </IconButton>
    </>
  );
}
