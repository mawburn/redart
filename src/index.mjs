import fs from 'fs'
import rimraf from 'rimraf'
import RegionMarket from './RegionMarket'
import ItemOrders from './ItemOrders'
import empire from '../eveData/empireRegions.json'

const outputDir = './tmp/items'
const empireMarket = empire.map(region => new RegionMarket(region).getData())



if(fs.existsSync(outputDir)) {
    rimraf(outputDir, () =>{
        fs.mkdirSync(outputDir)
    })
}

Promise.all(empireMarket)
    .then(data => {
        const marketData = [].concat(...data)
        const items = {}

        console.log(marketData)

        marketData.forEach(order => {
            let itemOrder = items[order.type] || new ItemOrders(order.type)

            if(order.buy) {
                itemOrder.orders.buy.push(order)
            } else {
                itemOrder.orders.sell.push(order)
            }

            items[order.type] = itemOrder
        })

        Object.keys(items).forEach(key => {
            const filteredData = ItemOrders.filterByProfit(items[key], 7)

            if(filteredData) {
                fs.writeFile(`${outputDir}/${key}.json`, JSON.stringify(filteredData), err => {
                    if(err) return console.log(err)
                })
            }        
        })
    }).catch(err => {
        console.log(err)
    })