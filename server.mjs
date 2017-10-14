import express from 'express'
import GoodOrders from './src/GoodOrders'

const app = express()
app.disable('etag')

const goodOrders = new GoodOrders()

const port = process.env.PORT || 8080
const updateKey = process.env.UPDATE_KEY || 'test'

app.get('/orders', (req, res) => {
  const orders = goodOrders.cache

  if(orders && orders.items || orders.pending) {
    res.type('json')
    res.send(orders)
  } else {
    res.status(204)
  }
})

app.get('/start/:id', (req, res) => {
  if(req.params.id === updateKey) {
    goodOrders.startUpdater()
    res.status(202)
    res.send('OK')
  } else {
    res.status('404')
  }
})

app.get('/stop/:id', (req, res) => {
  if(req.params.id === updateKey) {
    goodOrders.stopUpater()
    res.send('OK')
  } else {
    res.status('404')
  }
})
 
app.use('/', express.static('public'))

app.listen(port, () => {
  console.log(`Running on port ${port}`)
})
