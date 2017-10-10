import fs from 'fs'
import rimraf from 'rimraf'
import RegionMarket from './RegionMarket'
import ItemOrders from './ItemOrders'
import empire from '../eveData/empireRegions.json'

const outputDir = './tmp/items'
const empireMarket = empire.map(region => new RegionMarket(region).getData())

const exportData = () => {
    return new Promise((resolve, reject) => {
        console.log('getting items')

        Promise.all(empireMarket)
        .then(data => {
            console.log('got items')
            const marketData = [].concat(...data)
            const items = {}

            marketData.forEach(order => {
                let itemOrder = items[order.type] || new ItemOrders(order.type)

                if(order.buy) {
                    itemOrder.orders.buy.push(order)
                } else {
                    itemOrder.orders.sell.push(order)
                }

                items[order.type] = itemOrder
            })

            const finalItems = {}

            Object.keys(items).forEach(key => {
                finalItems[key] = ItemOrders.filterByProfit(items[key], 10)

                /* if(filteredData) {
                    fs.writeFile(`${outputDir}/${key}.json`, JSON.stringify(filteredData), err => {
                        if(err) return console.log(err)
                    })
                } */       
            })

            //fs.writeFile(`${outputDir}/items.json`, JSON.stringify(finalItems), err => {
            //   if(err) return console.log(err)
            // })

            resolve(finalItems)
        }).catch(err => {
            reject(err)
        })
    })
}

export default exportData


// if(fs.existsSync(outputDir)) {
//    rimraf(outputDir, () =>{
//        fs.mkdirSync(outputDir)
//    })
// }

