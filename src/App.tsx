import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import QrRedirect from './pages/QrRedirect';
import OurStory from './pages/OurStory';
import Visit from './pages/Visit';
import Contact from './pages/Contact';
import { RequireAuth } from './components/RequireAuth';
import Login from './pages/admin/Login';
import AdminProducts from './pages/admin/AdminProducts';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="p/:qr" element={<QrRedirect />} />
          <Route path="our-story" element={<OurStory />} />
          <Route path="visit" element={<Visit />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="/admin" element={<Login />} />
        <Route path="/admin/products" element={<RequireAuth><AdminProducts /></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}
