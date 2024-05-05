import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  Checkbox,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { supabase } from "../utils/supabase";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [meals, setMeals] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [anchorElCol, setAnchorElCol] = useState(null);
  const [anchorElRow, setAnchorElRow] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [opendOrder, setOpendOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select()
        .in("status", ["ORDERED", "IN_PROGRESS"]);
      if (orderError) throw orderError;

      const userIds = [...new Set(orderData.map((order) => order.user))];
      const mealIds = [...new Set(orderData.map((order) => order.meal))];
      const drinkIds = [...new Set(orderData.map((order) => order.drink))];

      const { data: userData, error: userError } = await supabase
        .from("users")
        .select()
        .in("id", userIds);
      console.log("User Data:", userData);

      const { data: mealData, error: mealError } = await supabase
        .from("meals")
        .select("*")
        .in("id", mealIds);
      console.log("Meal Data:", mealData);

      const { data: drinkData, error: drinkError } = await supabase
        .from("drinks")
        .select("*")
        .in("id", drinkIds);
      console.log("Drink Data:", drinkData);

      setOrders(orderData);
      setUsers(userData);
      setMeals(mealData);
      setDrinks(drinkData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    const channel = supabase
      .channel("realtime:orders")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          console.log("Change received!", payload);
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchOrders]);

  const confirmCancelOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "CANCELLED" })
      .eq("id", opendOrder)
      .select();

    if (error) {
      console.error("Error cancelling order:", error);
    } else {
      setOrders(
        orders.map((order) =>
          order.id === opendOrder ? { ...order, status: "CANCELLED" } : order
        )
      );
    }
    setOpenDialog(false);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Error updating order:", error);
    } else {
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    }
  };

  const filteredOrders = orders.filter((order) =>
    statusFilter ? order.status === statusFilter : true
  );

  return (
    <>
      <Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Patent Name</TableCell>
                <TableCell>Room Number</TableCell>
                <TableCell>Allergens</TableCell>
                <TableCell>Meal</TableCell>
                <TableCell>Drink</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="more"
                    aria-controls="long-menu"
                    aria-haspopup="true"
                    onClick={(event) => setAnchorElCol(event.currentTarget)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                <>
                  {filteredOrders.map((order) => {
                    const user = users.find((user) => user.id === order.user);
                    const meal = meals.find((meal) => meal.id === order.meal);
                    const drink = order.drink
                      ? drinks.find((drink) => drink.id === order.drink)
                      : null;

                    return (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>
                          {user ? user.name : "Unknown User"}
                        </TableCell>
                        <TableCell>
                          {user ? user.room_number : "Unknown Room Number"}
                        </TableCell>
                        <TableCell>
                          {user && user.allergens
                            ? user.allergens
                            : "No allergens listed"}
                        </TableCell>
                        <TableCell>{meal.name}</TableCell>
                        <TableCell>
                          {drink
                            ? `${drink.name} (${drink.description})`
                            : "No drink ordered"}
                        </TableCell>
                        <TableCell>{order.status}</TableCell>

                        <TableCell>
                          <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={(event) => {
                              setAnchorElRow(event.currentTarget);
                              setOpendOrder(order.id);
                            }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={8}>
                    <Typography variant="h6" component="div" textAlign="center">
                      No orders to display.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Menu
        id="long-menu"
        anchorEl={anchorElCol}
        open={Boolean(anchorElCol)}
        onClose={() => setAnchorElCol(null)}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem onClick={() => setStatusFilter("ORDERED")}>
          <Checkbox checked={statusFilter === "ORDERED"} />
          <ListItemText>Ordered</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setStatusFilter("IN_PROGRESS")}>
          <Checkbox checked={statusFilter === "IN_PROGRESS"} />
          <ListItemText>In Progress</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => setStatusFilter("")}>
          <ListItemText>Clear Filter</ListItemText>
        </MenuItem>
      </Menu>

      <Menu
        id="long-menu"
        anchorEl={anchorElRow}
        open={Boolean(anchorElRow)}
        onClose={() => setAnchorElRow(null)}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        <MenuItem
          disabled={opendOrder && opendOrder.status === "ORDERED"}
          onClick={() => {
            updateOrderStatus(opendOrder.id, "ORDERED");
            setAnchorElRow(null);
          }}
          style={
            opendOrder && opendOrder.status === "ORDERED"
              ? { color: "gray" }
              : {}
          }
        >
          Update to Ordered
        </MenuItem>
        <MenuItem
          disabled={opendOrder && opendOrder.status === "IN_PROGRESS"}
          onClick={() => {
            updateOrderStatus(opendOrder.id, "IN_PROGRESS");
            setAnchorElRow(null);
          }}
          style={
            opendOrder && opendOrder.status === "IN_PROGRESS"
              ? { color: "gray" }
              : {}
          }
        >
          Update to In Progress
        </MenuItem>
        <MenuItem
          disabled={opendOrder && opendOrder.status === "DELIVERED"}
          onClick={() => {
            updateOrderStatus(opendOrder.id, "DELIVERED");
            setAnchorElRow(null);
          }}
          style={
            opendOrder && opendOrder.status === "DELIVERED"
              ? { color: "gray" }
              : {}
          }
        >
          Update to Delivered
        </MenuItem>
        <MenuItem
          disabled={opendOrder && opendOrder.status === "CANCELLED"}
          onClick={() => {
            updateOrderStatus(opendOrder.id, "CANCELLED");
            setAnchorElRow(null);
          }}
          style={
            opendOrder && opendOrder.status === "CANCELLED"
              ? { color: "gray" }
              : {}
          }
        >
          Update to Cancelled
        </MenuItem>
        <MenuItem
          onClick={() => {
            setOpenDialog(true);
          }}
        >
          Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm Cancel Order"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to cancel this order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={confirmCancelOrder} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrdersPage;
