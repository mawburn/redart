import express from 'express'
import processOrders from './src/processOrders'
import moment from 'moment'
import timeout from 'connect-timeout'

const app = express()
const port = process.env.PORT || 8080

app.use(timeout('200s'));

let GOOD_ORDERS = {
    expires: moment().subtract(10, 'seconds').utc().format()
}

const pendingOrders = () => {
    return new Promise((resolve, reject) => {
        processOrders()
            .then(data => {
                console.log('done')
                GOOD_ORDERS = data
                resolve()
            })
        })
}

app.get('/', (req, res) => {
    if(moment().isAfter(GOOD_ORDERS.expires)) {
        pendingOrders()
            .then(() => res.send(GOOD_ORDERS))
            .catch(err => res.send(err))
    } else {
        res.send(GOOD_ORDERS)
    }   
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
