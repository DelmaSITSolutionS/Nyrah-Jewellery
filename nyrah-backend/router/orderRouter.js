const express = require("express");
const router = express.Router();
const { createOrderAfterPayment, updateOrderStatus, getAllOrders, getOrderDetailsByAdmin,getUserOrders } = require("../controllers/orderController");
const { isAuthenticatedUser,isAuthorizedRole} = require("../middleware/auth");

router
.post("/order/new", isAuthenticatedUser, createOrderAfterPayment)
.get("/order/:id",isAuthenticatedUser, getOrderDetailsByAdmin)
.get("/orders/my-orders", isAuthenticatedUser, getUserOrders);

router
.get("/admin/orders", isAuthenticatedUser,isAuthorizedRole("admin"), getAllOrders)
.put("/admin/order/status/:id",isAuthenticatedUser,isAuthorizedRole("admin"),updateOrderStatus)


module.exports = router;