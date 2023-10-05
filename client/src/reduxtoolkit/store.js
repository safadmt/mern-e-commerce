import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import dataInfoSlice from "./productReducer";
import userInfoSlice from './userReducer';
import cartInfoSlice from './cartReducer';
import OrderInfoSlice from "./orderReducer"
import brandReducer from "./brandReducer";
import categoryReducer from "./categoryReducer";
import subcategoryReducer from "./subcategoryReducer";
import adminReducer from "./adminReducer";

const store = configureStore({
    reducer: {
        productInfo: dataInfoSlice,
        userInfo: userInfoSlice,
        cartInfo: cartInfoSlice,
        orderInfo: OrderInfoSlice,
        brandInfo: brandReducer,
        categoryInfo: categoryReducer,
        subcategoryInfo: subcategoryReducer,
        adminInfo: adminReducer
    },
    middleware: getDefaultMiddleware => {
        return getDefaultMiddleware({
          serializableCheck: false
        });
      }
})

export default store;