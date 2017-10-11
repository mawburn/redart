import rimraf from 'rimraf'
import moment from 'moment'
import RegionMarket from './RegionMarket'
import ItemOrders from './ItemOrders'
import empire from '../eveData/empireRegions.json'
const outputDir = './tmp/items'

const processOrders = () => {
    return new Promise((resolve, reject) => {
        console.log('getting items...')
        const empireMarket = empire.map(region => new RegionMarket(region).getData())

        Promise.all(empireMarket)
            .then(data => {
                const marketData = [].concat(...data)
                console.log(`Got ${marketData.length} items!`)
                
                const items = {
                    expires: moment().add(300, seconds).utc().format()
                }

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
                })

                resolve(finalItems)
            }).catch(err => {
                reject(err)
            })
    })
}

export default processOrders