import requester from './requester'
import RegionMarket from './RegionMarket'
import ItemOrders from './ItemOrders' 
import empire from '../eveData/empireRegions.json'

const regionLimit = process.env.REGION_LIMIT || 5

const processMarketData = (data, oldData) => {
  const newData = oldData
  const marketData = [].concat(...data)

  marketData.forEach(order => {
    const itemOrder = newData[order.type] || new ItemOrders(order.type)

    if(order.buy) {
      delete order.buy
      itemOrder.orders.buy.push(order)
    } else {
      delete order.buy
      itemOrder.orders.sell.push(order)
    }

    newData[order.type] = itemOrder
  }) 

  return newData
}

const getRegionData = () => requester({
  chain: empire,
  data: {},
  requester: r => new RegionMarket(r).getData(),
  processor: processMarketData,
  limit: regionLimit,
})

const processOrders = () => getRegionData()
  .then(data => {
    const items = {}

    Object.keys(data).forEach(key => {
      items[key] = ItemOrders.filterByProfit(data[key], 10)
    })

    return items
  })


export default processOrders