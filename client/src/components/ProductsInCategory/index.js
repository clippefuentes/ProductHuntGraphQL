import React from 'react'
import Typography from '@mui/material/Typography'
import { useQuery } from '@apollo/client'

import ProductsList from '../ProductsList'
import { GET_PRODUCTS_IN_CATEGORY } from '../queries'

import {
  useParams
} from 'react-router-dom'

export default function ProductsInCategory() {
  const { slug } = useParams()

  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_PRODUCTS_IN_CATEGORY, {
    variables: { slug },
  })

  return (
    <>
      <Typography variant="h3">Products by in category {slug}</Typography>
      <ProductsList
        products={data?.productsByCategory || []}
        loading={loading}
        error={error}
        refetch={refetch} />
    </>
  )
}
