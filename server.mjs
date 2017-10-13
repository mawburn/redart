import express from 'express'
import processOrders from './src/processOrders'
import moment from 'moment'

const app = express()
const port = process.env.PORT || 8080

app.disable('etag')

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
    })
}

app.get('/orders', (req, res) => {
  const pending = GOOD_ORDERS.pending

  if(pending) {
    res.status('204')
    res.send('')
  } else if(moment().isAfter(GOOD_ORDERS.expires)) {
    !pending && pendingOrders()
    res.status('202')
    res.send('')
  } else {
    res.status('200')
    res.type('json')
    res.send(GOOD_ORDERS)
  }
})

app.use('/', express.static('public'))

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
