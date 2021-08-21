import React from 'react'

const ROUTE_URL = '/counter'

const routes = [
  {
    path: ROUTE_URL,
    component: React.lazy(() => import('pages/counter')),
    exact: true
  }
]

export const indexRoute = () => ROUTE_URL

export default routes