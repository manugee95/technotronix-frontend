import { createContext, useState, useEffect, useContext } from "react";
import useAlert from "../hooks/useAlert";
import AuthContext from "./AuthContext";

const EcomContext = createContext();

export const EcomProvider = ({ children }) => {
  const [state, dispatch] = useContext(AuthContext);
  const [product, setProduct] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [topSelling, setTopSelling] = useState([]);
  const [slide, setSlide] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0)
  const [order, setOrder] = useState(null)
  const { showAndHide, alertInfo } = useAlert();

  const isAuthenticated = state.accessToken !== null;

  useEffect(() => {
    fetchProduct();
    fetchCarousel();
    fetchFeatured();
    fetchTopSelling();
    fetchCart();
  }, []);

  useEffect(()=>{
    const count = cartItems.products?.reduce(
      (total, item) => total + item.quantity,
      0)

    setCartCount(count)
  }, [cartItems])

  // const getCartCount = () => {
  //   if (!cartItems || !cartItems.products) {
  //     return 0;
  //   } else {
  //     return cartItems.products.reduce(
  //       (total, item) => total + item.quantity,
  //       0
  //     );
  //   }
  // };

  // const featured = product.filter((item) => item.featured === true);
  // const topSelling = product.filter((item) => item.topSelling === true);
  const fetchFeatured = async () => {
    const res = await fetch("https://technotronix-api-qav1.onrender.com/api/product/featured");
    const data = await res.json();
    setFeatured(data);
  };
  const fetchTopSelling = async () => {
    const res = await fetch("https://technotronix-api-qav1.onrender.com/api/product/topSelling");
    const data = await res.json();
    setTopSelling(data);
  };

  const fetchProduct = async () => {
    const response = await fetch("https://technotronix-api-qav1.onrender.com/api/product");
    const data = await response.json();
    setProduct(data);
  };

  const fetchCarousel = async () => {
    const response = await fetch("https://technotronix-api-qav1.onrender.com/carousel");
    const data = await response.json();
    setSlide(data);
  };

  const addToCart = async (productId) => {
    try {
      const res = await fetch("https://technotronix-api-qav1.onrender.com/addToCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) {
        throw new Error("Something went wrong");
      }

      const data = await res.json();
      setCartItems(data);
      showAndHide("success", "item added to cart");
    } catch (error) {
      console.log(error.message);
      showAndHide("error", "Failed to add item to cart");
    }
  };

  const fetchCart = async () => {
    try {
      const res = await fetch("https://technotronix-api-qav1.onrender.com/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
      });

      if (!res.ok) {
        throw new Error("Somethig went wrong");
      }

      const data = await res.json();
      setCartItems(data);
    } catch (error) {
      console.error("Error getting cart", error);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (!quantity > 0) {
      showAndHide("error", "quantity cannot be less than 1");
      return;
    }
    try {
      const res = await fetch("https://technotronix-api-qav1.onrender.com/update-quantity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (res.ok) {
        const existingItemIndex = cartItems.products?.findIndex(
          (item) => item.product._id === productId
        );
        const updatedCartItem = [...cartItems.products];
        const itemToUpdate = updatedCartItem[existingItemIndex];
        itemToUpdate.quantity = quantity;
        itemToUpdate.amount =
          itemToUpdate.product.price * itemToUpdate.quantity;
        setCartItems({ ...cartItems, products: updatedCartItem });
        console.log(data);
      } else {
        console.error(data.msg || "Failed to update quantity");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await fetch("https://technotronix-api-qav1.onrender.com/delete-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
        },
        body: JSON.stringify({productId})
      })

      const data = await res.json()
      if (res.ok) {
        showAndHide("success", "item removed from cart")
        setCartItems(data)
      }else{
        console.error(data.msg || "Failed to remove item");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const totalAmount = () => {
    return cartItems.products?.reduce((total, item) => total + item.amount, 0);
  };

  const createOrder = async(transaction_id, orderId)=>{
    try {
      const response = await fetch("https://technotronix-api-qav1.onrender.com/api/payment/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`
        },
        body: JSON.stringify({transaction_id, orderId}),
        credentials: "include"
      })

      const data = await response.json()
      if (response.ok) {
        setOrder(data.order)
        setCartItems([])
      }else{
        console.error(data.msg)
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <EcomContext.Provider
      value={{
        featured,
        topSelling,
        product,
        slide,
        addToCart,
        cartItems,
        updateQuantity,
        removeItem,
        totalAmount,
        showAndHide,
        alertInfo,
        cartCount,
        createOrder,
        isAuthenticated
      }}
    >
      {children}
    </EcomContext.Provider>
  );
};

export default EcomContext;
