import { ReactElement, useEffect, useState } from "react";
import { FcEmptyTrash } from "react-icons/fc";
import CartCard from "./CartCard";
import { CartUrl } from "../ApiUrls";
import { Box, Button, Center, Heading, Spinner } from "@chakra-ui/react";

export interface ProductDetails {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
  };
  quantity: number;
}

export interface CartData {
  id: string;
  user_id: string;
  products: ProductDetails[]; //k
  totalAmount: number;
}
export enum IncDec {
  inc = 1,
  dec = 0,
}
function CartList(): ReactElement {
  const [cartProduct, setCartProduct] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toggle, setToggle] = useState<boolean>(false);

  let u_id: string | undefined; //ip
  const loginDetails = localStorage.getItem("isLoginLocal");
  if (loginDetails !== null) {
    const user_id = JSON.parse(loginDetails);
    const id = user_id.id;
    u_id = id;
  }

  const cartUrl = CartUrl;

  // getting cart data from the server
  useEffect(() => {
    fetch(`${cartUrl}/${u_id}`)
      .then((res) => res.json())
      .then((data: CartData) => {
        console.log(`${cartUrl}/${u_id}`);
        setCartProduct(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsLoading(false));
  }, [toggle]);

  //Handling each product increment and decrement
  const handleIncOrDec = (p_id: number, val: number) => {
    async function updateData(u_id: string) {
      try {
        // Get all cart details of an user using cartId
        let res = await fetch(`${cartUrl}/${u_id}`);
        let data: CartData = await res.json();

        let productsArray = data.products; //k

        // Increasing product quantity for a particular product in the cart
        if (val === 1) {
          productsArray.forEach((product) => {
            if (product.id === p_id) {
              product.quantity += 1;
            }
          });
        }
        // Decreasing product quantity for a partcular product in the cart
        else {
          productsArray.forEach((product) => {
            if (product.id === p_id) {
              product.quantity -= 1;
            }
          });

          //If the quantity will be zero then that product will be removed from the array
          productsArray = productsArray.filter(
            (product) => product.quantity > 0
          );
        }

        // Recalculate totalAmount after changing product quantity
        let newTotalAmount = productsArray.reduce(
          (total, product) => total + product.price * product.quantity,
          0
        );
        newTotalAmount = parseFloat(newTotalAmount.toFixed(2)); //rounding to 2 decimal places
        // Update cart details of the user using u_id
        let res2 = await fetch(`${cartUrl}/${u_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            products: productsArray,
            totalAmount: newTotalAmount,
          }),
          headers: {
            "Content-type": "application/json",
          },
        });

        if (res2.ok) setToggle(!toggle);
      } catch (err) {
        console.error(err);
      }
    }

    updateData(u_id as string); //invoking updateData
  };

  const handleEmpty = (u_id: number | string) => {
    async function emptyProductArray() {
      try {
        let res = await fetch(`${cartUrl}/${u_id}`, {
          method: "PATCH",
          body: JSON.stringify({
            products: [],
            totalAmount: 0
          }),
          headers: {
            "Content-type": "application/json",
          },
        });

        if(res.ok) setToggle(!toggle);
      } catch (error) {
        console.error(error);
      }
    }
    emptyProductArray();
  };

  const handleCheckout = () => {
    // Redirect the user to the UserDetails page
    window.location.href = "/order-list";
  };
  return (
    <>
      {isLoading ? (
        <Center height="100vh">
       <Spinner
       thickness='4px'
       speed='0.65s'
       emptyColor='gray.200'
       color='yellow.400'
       size='xl'
     />
     </Center> // Show loading message while fetching data fontSize={{ base: "24px", md: "40px", lg: "56px" }}
      ) : (
        <Box >
          {cartProduct &&
          cartProduct.products &&
          cartProduct.products.length > 0 ? (
            <Box  w={{ base: "100%", md: "80%", lg: "70%" }} >
              <Heading as='h2'>Cart Items</Heading>
              <Box display={{lg:"flex"}}>
              <Box w={{ base: "100%", md: "80%", lg: "70%" }} >
              {cartProduct.products.map((product) => (
                <CartCard
                  key={product.id}
                  product={product}
                  handleIncOrDec={handleIncOrDec}
                />
              ))}
              </Box>
              <Box position="sticky">
              <Button bg="orange">Total : {cartProduct.totalAmount}</Button>
              <FcEmptyTrash
                onClick={() => {
                  handleEmpty(cartProduct.id);
                }}
              />
              <Button onClick={handleCheckout}>Proceed to Checkout</Button>
              </Box>
              </Box>
            </Box>

          ) : (
            <Box
              border="1px solid red"
              justifyContent="center"
              width="100%"
              height="100vh"
              alignItems="center"
              display="flex"
            >
              <Box
                bg="hotpink"
                boxShadow="dark-lg"
                alignItems="center"
                justifyContent="center"
                p="6"
                rounded="md"
                w="50%"
                color="white"
                h="50vh"
                fontSize="50px"
              >
                <Heading marginTop="15%" textAlign="center">
                  Cart is empty
                </Heading>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default CartList;
