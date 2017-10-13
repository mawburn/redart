import express from 'express'
import processOrders from './src/processOrders'
import moment from 'moment'
import timeout from 'connect-timeout'

const app = express()
const port = process.env.PORT || 8080

let GOOD_ORDERS = {
  expires: moment().subtract(10, 'seconds').utc().format(),
  pending: false,
}

const pendingOrders = () => {
  const oldExpires = GOOD_ORDERS.expires

  GOOD_ORDERS = {
    expires: oldExpires,
    pending: true,
  }

  processOrders()
    .then(data => {
      GOOD_ORDERS = {
        pending: false,
        ...data,
      }

      console.log('done')
      resolve()
    })
}

app.get('/', (req, res) => {
  if(moment().isAfter(GOOD_ORDERS.expires)) {
    pendingOrders()
    res.status('202')
    res.send('')
  } else if(GOOD_ORDERS.pending) {
    res.status('204')
  } else {
    res.status('200')
    res.type('json')
    res.send(GOOD_ORDERS)
  }
})

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
