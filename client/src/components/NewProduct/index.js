import React from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import * as yup from 'yup'
import { useFormik } from 'formik'
import { useNavigate } from "react-router-dom";

import { Typography } from '@mui/material'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import LaunchIcon from '@mui/icons-material/Launch'
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'

import GraphQLError from '../GraphQLError'
import './NewProduct.css'

const GET_ALL_CATEGORIES = gql`
  query {
    allCategories {
      id
      slug
      name
    }
  }
`

const CREATE_PRODUCT = gql`
  mutation Mutation($input: NewProduct) {
    createProduct(input: $input) {
      id
      name
      description
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

function NewProduct() {
  const {
    data,
    loading,
    error,
    refetch
  } = useQuery(GET_ALL_CATEGORIES)

  const navigate = useNavigate();

  const [
    mutateFunction,
    {
      loading: mutationLoading,
      error: mutationError
    }
  ] = useMutation(CREATE_PRODUCT,
    {
      refetchQueries: [
        'AllProducts',
      ],
    })

  const validationSchema = yup.object({
    name: yup
      .string('Enter product name')
      .required('Product name is required'),
    description: yup
      .string('Enter product description')
      .required('Product description is required'),
    url: yup
      .string('Enter a valid product URL')
      .required('Product URL is required'),
    categoriesIds: yup
      .array()
      .min(1)
  })

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      url: '',
      categoriesIds: [],
    },
    validationSchema: validationSchema,
    onSubmit: async values => {
      try {
        console.log('values', values)
        await mutateFunction({
          variables: {
            input: values
          }
        })

        navigate('/')
      } catch (e) {
        console.error(e)
      }
    }
  })

  const categories = data?.allCategories || []

  if (error) {
    return <GraphQLError
      error={error}
      refetch={refetch} />
  }

  function renderAutocomplete(loading, categories, formik) {
    if (loading) {
      return <CircularProgress />
    }

    return <Autocomplete
      id="categoriesIds"
      name="categoriesIds"
      multiple
      // id="size-small-filled-multi"
      size="medium"
      options={categories}
      getOptionLabel={(option) => option.name}
      defaultValue={[]}
      onChange={(e, value) => {
        // Get a list of category IDs selected by a user
        const categoriesIds = value.map(v => v.id)
        // Update Formik's state to reflect this
        formik.setFieldValue('categoriesIds', categoriesIds)
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            key={option.id}
            variant="outlined"
            label={option.name}
            size="medium"
            {...getTagProps({ index })}
          />
        ))}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          className='formField'
          label="Categories"
          error={formik.touched.categoriesIds
            && Boolean(formik.errors.categoriesIds)}
          helperText={formik.touched.categoriesIds && formik.errors.categoriesIds}
        />
      )}
    />
  }


  return (
    <>
      <Typography variant="h3">Create New Product</Typography>

      {mutationError && <Typography
        variant="body2"
        style={{ color: '#c62828' }}
        className='formField'>
        Failed to create a new product
      </Typography>}

      <form noValidate onSubmit={formik.handleSubmit}>
        <TextField
          id="name"
          name="name"
          label="Product name"
          variant="outlined"
          fullWidth
          required
          className='formField'
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
        <TextField
          id="description"
          name="description"
          label="Product description"
          variant="outlined"
          fullWidth
          required
          multiline
          rows={5}
          className='formField'
          value={formik.values.description}
          onChange={formik.handleChange}
          error={formik.touched.description
            && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
        />
        <TextField
          id="url"
          name="url"
          label="URL"
          variant="outlined"
          fullWidth
          required
          className='formField'
          value={formik.values.url}
          onChange={formik.handleChange}
          error={formik.touched.url && Boolean(formik.errors.url)}
          helperText={formik.touched.url && formik.errors.url}
        />
        {renderAutocomplete(loading, categories, formik)}
        <Button
          type="submit"
          color="primary"
          variant="contained"
          endIcon={<LaunchIcon />}
          disabled={loading}
        >
          {mutationLoading && <CircularProgress size={14} />}
          {!mutationLoading && 'Create'}
        </Button>
      </form>
    </>
  )
}

export default NewProduct
