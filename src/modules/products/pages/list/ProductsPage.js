import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import Page from 'components/page/Page'
import PageTile from 'components/page/PageTile'
import OrderedTableHead from 'components/table/OrderedTableHead'
import useTable from 'hooks/useTable'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import withReducer from 'store/withReducer'
import { toStringDateTime } from 'utils/date'
import { toStringCurrency } from 'utils/format'
import config from '../../config'
import reducers from '../../store'
import { getProducts, resetProducts, selectAllProducts } from '../../store/productsSlice'

const header = [
  // { id: 'id', label: 'ID', sort: o => parseInt(o.id, 10) },
  { id: 'categoryId', label: 'Category', sort: o => o.categoryId },
  { id: 'name', label: 'Name' },
  { id: 'description', label: 'Description' },
  { id: 'active', label: 'Active' },
  { id: 'quantity', label: 'Quantity' },
  { id: 'value', label: 'Value' },
  { id: 'createdAt', label: 'Created At' },
  { id: 'updatedAt', label: 'Updated At' },
  { id: 'actions', label: '', sort: false }
]

const ProductsPage = () => {
  const dispatch = useDispatch()

  const products = useSelector(selectAllProducts)

  const { order, handleRequestSort, getFilteredData } = useTable(0, 5, 'name')

  useEffect(() => {
    dispatch(resetProducts())
    dispatch(getProducts())
  }, [dispatch])

  return (
    <Page
      classes={{
        root: 'p-24'
      }}
      header={<PageTile>Products</PageTile>}
      content={
        <Paper>
          <TableContainer>
            <Table size='medium'>
              <OrderedTableHead data={header} order={order} onRequestSort={handleRequestSort} />
              <TableBody>
                {getFilteredData(header, products).map(row => {
                  return (
                    <TableRow hover key={row.id}>
                      {/* <TableCell align='left'>{row.id}</TableCell> */}
                      <TableCell align='left'>{row.categoryId}</TableCell>
                      <TableCell align='left'>{row.name}</TableCell>
                      <TableCell align='left'>{row.description}</TableCell>
                      <TableCell align='left'>{row.active ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell align='right'>{row.quantity}</TableCell>
                      <TableCell align='right'>{toStringCurrency(row.value)}</TableCell>
                      <TableCell align='left'>{toStringDateTime(row.createdAt)}</TableCell>
                      <TableCell align='left'>{toStringDateTime(row.updatedAt)}</TableCell>
                      <TableCell align='left'>-</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      }
    />
  )
}

export default withReducer(config.moduleKey, reducers)(ProductsPage)
