import React, { useEffect } from 'react'
import Typography from '@mui/material/Typography'
import { gql, useQuery } from '@apollo/client'

import allProducts from '../test-data'
import ProductsList from '../ProductsList'

const GET_ALL_PRODUCTS = gql`
query {
  allProducts {
    id
    description
    name
    url
    numberOfVotes
    publishedAt
    author {
      id
      userName
      fullName
    }
    categories {
      id
      slug
      name
    }
  }
}
`

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
