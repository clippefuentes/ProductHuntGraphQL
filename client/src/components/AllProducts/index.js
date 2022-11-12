import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { useQuery } from '@apollo/client'

import { GET_ALL_PRODUCTS } from '../queries'
import ProductsList from '../ProductsList'

export default function AllProducts() {
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_ALL_PRODUCTS)

  useEffect(() => {
    console.log({
      data,
      loading,
      error,
      refetch
    })
  }, [data, loading, error, refetch])
  return (
    <>
      <Typography variant="h3">Products</Typography>
      <ProductsList
        products={data?.allProducts || []}
        loading={loading}
        error={error}
        refetch={refetch} />
    </>
  )
}
