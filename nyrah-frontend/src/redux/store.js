import {configureStore} from "@reduxjs/toolkit"
import categoryReducer from "./slices/categorySlice"
import userReducer from "./slices/userSlice"
import optionsReducer from "./slices/optionSlice"
import productReducer from "./slices/productSlice"
import cartReducer from "./slices/cartSlice"
import chargesReducer from "./slices/chargesSlice"; 
import orderReducer from "./slices/orderSlice"
import materialReducer from "./slices/materialSlice"
import instapostReducer from "./slices/instaPostSlice"
import discountBannerReducer from "./slices/discountBannerSlice"
import customizationReducer from "./slices/customizationSlice"
import currencyReducer from "./slices/currencySlice"

const store = configureStore({
    reducer:{
        category: categoryReducer,
        user:userReducer,
        options: optionsReducer,
        product: productReducer,
        cart:cartReducer,
        charges:chargesReducer,
        order: orderReducer,
        material: materialReducer,
        instapost: instapostReducer,
        discountBanner: discountBannerReducer,
        customization: customizationReducer,
        currency: currencyReducer
    }
})

export default store;