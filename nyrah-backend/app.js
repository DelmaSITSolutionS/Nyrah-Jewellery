const express = require('express');
const cors = require('cors');
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error")

const app = express();

// Middlewares
app.use(cors({
    origin:[`${process.env.FRONTEND_URI}`],
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const userRoute = require("./router/userRouter");
const categoryRoute = require("./router/categoryRouter")
const optionsRoute = require("./router/optionsRouter")
const productRoute = require("./router/productRouter");
const cartRoute = require('./router/cartRouter');
const paymentRoute = require("./router/paymentRouter")
const orderRoute = require("./router/orderRouter")
const chargeRoute = require("./router/chargeRouter")
const contactRoute = require("./router/contactRouter")
const materialMenuRoute = require("./router/materialMenuRouter")
const ratingRoute = require("./router/ratingRouter")
const instaPostRoute = require("./router/instaPostRouter")
const discountBannerRoute = require("./router/discountBannerRouter")
const customizationRoute = require("./router/customizationRouter")


app.use("/api/v1",userRoute)
app.use("/api/v1",categoryRoute)
app.use("/api/v1",optionsRoute)
app.use("/api/v1",productRoute)
app.use("/api/v1",cartRoute)
app.use("/api/v1",paymentRoute)
app.use("/api/v1",orderRoute)
app.use("/api/v1",chargeRoute)
app.use("/api/v1",contactRoute)
app.use("/api/v1",materialMenuRoute)
app.use("/api/v1",ratingRoute)
app.use("/api/v1",instaPostRoute)
app.use("/api/v1",discountBannerRoute)
app.use("/api/v1",customizationRoute)

// error 
app.use(errorMiddleware)

// Export app for use in server or tests
module.exports = app;