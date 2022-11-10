import React from 'react'
import { Grid } from '@mui/material'
import PropTypes from 'prop-types'
import Product from '../Product'

import './ProductsList.css'

function ProductsList(props) {
  const {products} = props
  return (
    <Grid container spacing={3} className="productsList">
      {products.map((product) => (
        <Product
          product={product}
          key={product.id} />
      ))}
    </Grid>
  )
}

ProductsList.propTypes = {
  products: PropTypes.array.isRequired,
}

export default ProductsList