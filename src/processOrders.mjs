import rimraf from 'rimraf'
import moment from 'moment'
import requester from './requester'
import RegionMarket from './RegionMarket'
import ItemOrders from './ItemOrders'
import empire from '../eveData/empireRegions.json'

const regionLimit = process.env.REGION_LIMIT || 5

const processMarketData = (data, oldData) => {
  const newData = oldData
  const marketData = [].concat(...data)

  marketData.forEach(order => {
    let itemOrder = newData[order.type] || new ItemOrders(order.type)

    if(order.buy) {
      itemOrder.orders.buy.push(order)
    } else {
      itemOrder.orders.sell.push(order)
    }

    newData[order.type] = itemOrder
  })

  return newData
}

const getRegionData = () => {
  return requester({
    chain: empire,
    data: {},
    requester: (r) => new RegionMarket(r).getData(),
    processor: processMarketData,
    limit: regionLimit,
  })
}

const processOrders = () => {
  return getRegionData()
    .then(data => {
      const items = {
        expires: moment().add(300, 'seconds').utc().format()
      }

      Object.keys(data).forEach(key => {
        items[key] = ItemOrders.filterByProfit(data[key], 10)
      })

      return items
    })
}

export default processOrders