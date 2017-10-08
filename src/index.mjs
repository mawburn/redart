import fs from 'fs'
import RegionMarket from './RegionMarket'
import ItemOrders from './ItemOrders'
import empire from '../eveData/empireRegions.json'

const empireMarket = empire.map(region => new RegionMarket(region).getData())

Promise.all(empireMarket)
    .then(data => {
        const marketData = [].concat(...data)
        const items = {}

        marketData.forEach(order => {
            let itemOrder = items[order.type] || new ItemOrders(order.type)
            console.log(itemOrder)

            if(order.buy) {
                itemOrder.orders.buy.push(order)
            } else {
                itemOrder.orders.sell.push(order)
            }

            items[order.type] = itemOrder
        })

        console.log(marketData.length, Object.keys(items))

        Object.keys(items).forEach(key => {
            fs.writeFile(`./tmp/items/${key}.json`, JSON.stringify(items[key]), err => {
                if(err) return console.log(err)
            })
        })
    }).catch(err => {
        console.log(err)
    })