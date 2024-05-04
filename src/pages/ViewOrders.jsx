import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  CardMedia,
  Modal,
} from "@mui/material";
import { supabase } from "../utils/supabase";

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user", user.data.user.id);
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          const meals = await Promise.all(
            orders.map((order) =>
              supabase.from("meals").select("*").eq("id", order.meal)
            )
          );
          const ordersWithMealData = orders.map((order, index) => ({
            ...order,
            mealData: meals[index].data[0],
          }));
          setOrders(ordersWithMealData);
        }
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "CANCELLED" })
      .eq("id", orderId);
    if (error) {
      console.error("Error cancelling order:", error);
    } else {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        gap={2}
        mt={2}
        mb={2}
      >
        {orders.map((order, index) => (
          <Card
            key={index}
            sx={{ minWidth: 275, marginBottom: 2, width: "80%" }}
          >
            <CardMedia
              component="img"
              height="140"
              image={order.mealData.image}
              alt={order.mealData.name}
              onClick={() => {
                setSelectedMeal(order.mealData);
                setOpen(true);
              }}
            />
            <CardContent>
              <Typography variant="h5" component="div">
                {order.mealData.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Meal Type: {order.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {order.status}
              </Typography>
              {order.status === "ORDERED" && (
                <Button onClick={() => cancelOrder(order.id)}>
                  Cancel Order
                </Button>
              )}
              <Button
                onClick={() => {
                  setSelectedMeal(order.mealData);
                  setOpen(true);
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedMeal(null);
        }}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "auto",
        }}
      >
        <Box
          sx={{
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 1,
          }}
        >
          <h2>{selectedMeal?.name}</h2>
          <p>{selectedMeal?.description}</p>
        </Box>
      </Modal>
    </>
  );
};

export default ViewOrders;
