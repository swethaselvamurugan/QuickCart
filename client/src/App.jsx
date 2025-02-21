import { Route, Routes } from 'react-router-dom'
import AuthLogin from './pages/auth/login'
import AuthLayout from './components/auth/layout'
import AuthRegister from './pages/auth/register'
import AdminLayout from './components/admin-panel/layout'
import AdminDashboard from './pages/admin-panel/dashboard'
import AdminOrders from './pages/admin-panel/orders'
import AdminProducts from './pages/admin-panel/products'
import ShoppingLayout from './components/shopping-panel/layout'
import NotFound from './pages/not-found'
import ShoppingHome from './pages/shopping-panel/home'
import ShoppingListing from './pages/shopping-panel/listing'
import ShoppingCheckout from './pages/shopping-panel/checkout'
import ShoppingAccount from './pages/shopping-panel/account'
import CheckAuth from './components/common/check-auth'
import UnauthPage from './pages/unauth-page'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { checkAuth } from './store/auth-slice'
import { Skeleton } from "@/components/ui/skeleton"
import PaypalReturnPage from './pages/shopping-panel/paypal-return'
import PaymentSuccessPage from './pages/shopping-panel/payment-success'
import SearchProducts from './pages/shopping-panel/search'


function App() {

  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = JSON.parse(sessionStorage.getItem("Token"));
    dispatch(checkAuth(token));
  }, [dispatch]);

  if (isLoading) return (
    <div className="flex flex-col space-y-3 justify-center items-center h-screen">
      <Skeleton className="h-[400vw] w-[800vw] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-[16vw] w-[600vw]" />
        <Skeleton className="h-[16vw] w-[550vw]" />
      </div>
    </div>
  )

  return (
    <div className='flex flex-col overflow-hidden bg-white'>
      {/* Authentication component */}
      <Routes>
        <Route path='/' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout /></CheckAuth>} />
        <Route path='/auth' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AuthLayout /></CheckAuth>}>
          <Route path='login' element={<AuthLogin></AuthLogin>} />
          <Route path='register' element={<AuthRegister></AuthRegister>} />
        </Route>
        {/* Admin component */}
        <Route path='/admin' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><AdminLayout /></CheckAuth>}>
          <Route path='dashboard' element={<AdminDashboard></AdminDashboard>} />
          <Route path='products' element={<AdminProducts></AdminProducts>} />
          <Route path='orders' element={<AdminOrders></AdminOrders>} />
        </Route>
        {/* Shopping component */}
        <Route path='/shop' element={<CheckAuth isAuthenticated={isAuthenticated} user={user}><ShoppingLayout /></CheckAuth>}>
          <Route path='home' element={<ShoppingHome></ShoppingHome>} />
          <Route path='listing' element={<ShoppingListing></ShoppingListing>} />
          <Route path='checkout' element={<ShoppingCheckout></ShoppingCheckout>} />
          <Route path='account' element={<ShoppingAccount></ShoppingAccount>} />
          <Route path='search' element={<SearchProducts></SearchProducts>} />
          <Route path='paypal-return' element={<PaypalReturnPage></PaypalReturnPage>} />
          <Route path='payment-success' element={<PaymentSuccessPage></PaymentSuccessPage>} />
        </Route>
        {/* Not found component */}
        <Route path='*' element={<NotFound></NotFound>}></Route>
        {/* Unauth Page */}
        <Route path='/unauth-page' element={<UnauthPage></UnauthPage>}></Route>
      </Routes>
    </div>
  )
}

export default App
