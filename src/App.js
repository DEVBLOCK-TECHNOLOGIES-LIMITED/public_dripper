import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./components/Header";
import FloatButton from "./components/FloatButton";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Search from "./pages/Search";
import Catalog from "./pages/Catalog";
import { useEffect } from "react";
import { getProducts } from "./features/products/productSlice";
import { getCart } from "./features/cart/cartSlice";

import { useDispatch, useSelector } from "react-redux";
import CartMock from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";

import AdminRoute from "./superuser/AdminRoute";
import DashboardAdmin from "./superuser/admin/Admin";
import ProductManagement from "./superuser/admin/ProductManagement";
import OrderManagement from "./superuser/admin/OrderManagement";
import UserManagement from "./superuser/admin/UserManagement";
import Discounts from "./superuser/admin/Discounts";

function App() {
  const email = useSelector((state) => state.auth.user?.data?.email);

  const dispatch = useDispatch();

  useEffect(() => {
    if (email) {
      dispatch(getCart({ email }));
    }
  }, [email, dispatch]);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/product/:code" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />

        <Route path="/cart" element={<CartMock />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="discounts" element={<Discounts />} />
        </Route>
      </Routes>
      <Footer />
      <FloatButton />
    </>
  );
}

export default App;
