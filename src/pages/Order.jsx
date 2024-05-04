import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Card,
  CardContent,
  Grid,
  Checkbox,
  CardActionArea,
  FormControlLabel,
  Modal,
  CardMedia,
  CardActions,
} from "@mui/material";
import { supabase } from "../utils/supabase";

const Order = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mealType, setMealType] = useState("");
  const [meal, setMeal] = useState("");
  const [selectedMealData, setSelectedMealData] = useState(null);
  const [meals, setMeals] = useState([]);
  const [open, setOpen] = useState(false);
  const [userOrders, setUserOrders] = useState([]);

  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase.from("meals").select();
      if (error) {
        console.error("Error fetching meals:", error);
      } else {
        setMeals(data);
      }
    };

    const fetchUserOrders = async () => {
      const user = await supabase.auth.getUser();
      if (user) {
        const { data: orders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user", user.data.user.id);
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
        } else {
          setUserOrders(orders);
        }
      }
    };

    fetchMeals();
    fetchUserOrders();
  }, []);

  const confirmOrder = async () => {
    const user = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("orders").insert({
        meal: selectedMealData.id,
        type: mealType,
        user: user.data.user.id,
        status: "ORDERED",
      });

      if (error) {
        console.error("Error inserting order:", error);
      }
    }
  };

  const mealsTypes = ["Breakfast", "Lunch", "Snack", "Dinner"];

  return (
    <>
      <Stepper activeStep={activeStep} sx={{ m: "2em" }}>
        <Step>
          <StepLabel>
            <Typography variant="h5">When?</Typography>
            <Typography
              variant="body2"
              sx={{ maxWidth: "300px", wordWrap: "break-word" }}
            >
              What meal are you having? (breakfast, lunch, dinner)
            </Typography>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="h5">What?</Typography>
            <Typography
              variant="body2"
              sx={{ maxWidth: "300px", wordWrap: "break-word" }}
            >
              Choose the food you’d like.
            </Typography>
          </StepLabel>
        </Step>
        <Step>
          <StepLabel>
            <Typography variant="h5">Confirm</Typography>
            <Typography
              variant="body2"
              sx={{ maxWidth: "300px", wordWrap: "break-word" }}
            >
              See the progress of your order.
            </Typography>
          </StepLabel>
        </Step>
      </Stepper>
      {activeStep === 0 && (
        <Grid container direction="column" spacing={2}>
          {mealsTypes.map((meal, index) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const isMealOrderedToday = userOrders.some(
              (order) =>
                order.type === meal &&
                order.status === "ORDERED" &&
                new Date(order.created_at) >= today
            );

            return (
              <Grid item key={index}>
                <Box m={2}>
                  <Card
                    elevation={mealType === meal ? 3 : 1}
                    sx={{
                      borderRadius: 2,
                      opacity: isMealOrderedToday ? 0.5 : 1,
                    }}
                  >
                    <CardActionArea
                      onClick={() => setMealType(meal)}
                      disabled={isMealOrderedToday}
                    >
                      <CardContent>
                        <FormControlLabel
                          control={
                            <Checkbox checked={mealType === meal} name={meal} />
                          }
                          label={<Typography variant="h5">{meal}</Typography>}
                        />
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}
      {activeStep === 1 && (
        <Grid container spacing={2}>
          {meals.map((mealItem, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box m={2}>
                <Card
                  elevation={meal === mealItem.name ? 3 : 1}
                  sx={{ borderRadius: 2 }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image="/path/to/image.jpg"
                    alt={mealItem.name}
                  />
                  <CardActionArea
                    onClick={() => {
                      setMeal(mealItem.name);
                      setSelectedMealData(mealItem);
                    }}
                  >
                    <CardContent>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={meal === mealItem.name}
                            name={mealItem.name}
                          />
                        }
                        label={
                          <Typography variant="h5">{mealItem.name}</Typography>
                        }
                      />
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => {
                        setOpen(true);
                        setSelectedMealData(mealItem);
                      }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
      {activeStep === 2 && (
        <Box>
          <Box sx={{ m: "2em" }}>
            <Typography variant="h5">You have selected:</Typography>
            {meals
              .filter((mealItem) => mealItem.name === meal)
              .map((selectedMeal, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={selectedMeal.image}
                      alt={selectedMeal.name}
                    />
                    <CardContent>
                      <Typography variant="h5">{selectedMeal.name}</Typography>
                      <Typography variant="body2">
                        {selectedMeal.description}
                      </Typography>
                      <Typography variant="body2">
                        Type: {selectedMeal.type}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          m: "2em",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#fff",
        }}
      >
        <Button
          disabled={activeStep === 0}
          onClick={() => setActiveStep((prevActiveStep) => prevActiveStep - 1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          disabled={
            activeStep === 0 ? !mealType : activeStep === 1 ? !meal : false
          }
          onClick={() => {
            if (activeStep < 2) {
              setActiveStep((prevActiveStep) => prevActiveStep + 1);
            } else {
              confirmOrder();
            }
          }}
        >
          {activeStep === 2 ? "Confirm" : "Next"}
        </Button>
      </Box>

      <Modal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedMealData(null);
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
          <h2>{selectedMealData?.name}</h2>
          <p>More information about the meal...</p>
        </Box>
      </Modal>
    </>
  );
};

export default Order;
