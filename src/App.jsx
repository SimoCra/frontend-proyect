import { Routes, Route , Navigate} from 'react-router-dom';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Dashboard from './pages/users/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/admin/AdminLayout'; 
import PublicHome from './pages/public/PublicHome';
import CreateProduct from './pages/admin/CreateProduct';
import DeleteUser from './pages/admin/DeleteUsers';
import ProductDetail from './pages/public/ProductDetail';
import Cart from './pages/users/Cart';
import AdminDashboard from './pages/admin/AdminDashboard';
import ResetPassword from './pages/public/ResetPassword';
import Productos from './pages/public/Products';
import AddressForm from './pages/users/CompletePayment';
import CheckoutSummary from './pages/users/CheckoutSummary';
import UserOrders from './pages/users/UserOrders';
import EditOrdersUsers from './pages/admin/EditOrdersUsers';
import CategoriesAdmin from './pages/admin/CategoriesAdmin';
import CategoriesAdminProducts from './pages/admin/CategoriesAdminProducts';
import EditProducts from './pages/admin/EditProducts';
import EditProductVariantsPage from './pages/admin/EditProductVariant';
import Contact from './pages/public/Contact'
import About from './pages/public/About'
import GlobalNotificationsPage from './pages/admin/GlobalNotificationPage';
import ContactRequestsAdminPage from './pages/admin/ContactRequestAdminPage';

function App() {
  return (
    <>
      <Routes>

        {/* Rutas públicas */}
        <Route path='/' element={<PublicHome />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/reset-password/*' element={<ResetPassword/>}/>
        <Route path="/products" element={<Navigate to="/products/page/1" replace />} />
        <Route path="/products/page/:pageNumber" element={<Productos />} />
        <Route path='/products/:name' element={<ProductDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />

        {/* Rutas protegidas - usuario */}
        <Route path='/cart-buy' element={
          <ProtectedRoute>
            <Cart/>
          </ProtectedRoute>
        }/>
        <Route path='/checkout/addressed' element={
          <ProtectedRoute>
            <AddressForm/>
          </ProtectedRoute>
        }/>
        <Route path='/checkout/summary' element={
          <ProtectedRoute>
            <CheckoutSummary/>
          </ProtectedRoute>
        }/>
        <Route path='/my-orders' element={
          <ProtectedRoute>
            <UserOrders/>
          </ProtectedRoute>
        }/>
        <Route path='/account' element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }/>

        {/* Rutas protegidas - admin */}
        <Route path='/admin' element={
          <ProtectedRoute role='admin'>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path='orders-users' element={<EditOrdersUsers/>} />
          <Route path='create-product' element={<CreateProduct />} />  
          <Route path='users' element={<DeleteUser/>}/>
          <Route path='dashboard-stats' element={<AdminDashboard/>}/>
          <Route path='categories' element={<CategoriesAdmin/>}/>
          <Route path='products/edit/:id' element={<EditProducts />} />
          <Route path='products/edit/variants/:productId' element={<EditProductVariantsPage/> }/>
          <Route path='global-notification' element={<GlobalNotificationsPage/>}/>
          <Route path='contact-requests' element={<ContactRequestsAdminPage/>}/>

          {/* 👇 Nueva ruta: productos dentro de una categoría */}
          <Route path='categories/:id/products' element={<CategoriesAdminProducts/>}/>
        </Route>

      </Routes>
    </>
  );
}

export default App;
