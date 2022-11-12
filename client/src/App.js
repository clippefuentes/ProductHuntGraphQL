import React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import createCache from '@emotion/cache'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom'

import Header from './components/Header'
import Layout from './components/Layout'
import AllProducts from './components/AllProducts'
import ProductsByUser from './components/ProductsByUser'
import ProductsInCategory from './components/ProductsInCategory'
import NewProduct from './components/NewProduct'
import Login from './components/Login'


const cache = createCache({
  key: 'css',
  prepend: true,
})

const theme = createTheme({
  palette: {
    background: {
      default: '#FAFAFA'
    }
  }
})



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cache}>
        <Router>
          <div className="App">
            <CssBaseline />
            <Header />
            <Layout>
              <Routes>
                <Route path="/create" element={<NewProduct />} />                  
                <Route path="/author/:userName" element={<ProductsByUser />} />
                <Route path="/category/:slug" element={<ProductsInCategory /> } />
                <Route path="/" element={<AllProducts />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </Layout>
          </div>
        </Router>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App;
