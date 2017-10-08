import fs from 'fs'
import getMarket from './regionMarket'

getMarket('10000002')
    .then(orders => {
        fs.writeFile('./tmp/buyOrders.json', JSON.stringify(orders.buy), err => {
            if(err) {
                return console.log(err)
            }
        })

        fs.writeFile('./tmp/sellOrders.json', JSON.stringify(orders.sell), err => {
            if(err) {
                return console.log(err)
            }
        })
    })