import moment from 'moment'
import s3upload from './s3upload'
import RegionMarket from '../models/RegionMarket'
import ItemOrders from '../models/ItemOrders'
import requester from '../util/requester'
import empire from '../../eveData/empireRegions'

const regionLimit = process.env.REGION_LIMIT || 5 

export default class UpdateOrders {
  constructor() {
    this.expires = moment().utc().format()
    this.pending = false
    this.items = {}
    this.regionLimit = process.env.REGION_LIMIT || 5
    this.currentStatus = 'empty'

    this.getItems = this.getItems.bind(this)
  }

  get cache() { 
    return {
      expires: this.expires,
      items: this.items, 
    }
  }

  get status() {
    return {
      status: this.currentStatus,
      expires: this.expires,
      pending: this.pending,
    }
  }

  updater() {
    if(!this.pending && moment().isAfter(this.expires)) {
      console.log('\n-------[ Updating Orders ]-------')
      this.expires = moment().add(300, 'seconds').utc().format()
      this.getItems()
    } else if (this.pending) {
      console.log('Update Pending')
    } 
  }

  getItems(shouldUpload = true) {
    this.pending = true
    this.currentStatus = 'pending'

    this.getRegionData()
        .then(data => {
            const items = {}

            Object.keys(data).forEach(key => {
              const filteredOrders = ItemOrders.filterByProfit(data[key], 10)

              if(filteredOrders) {
                items[key] = filteredOrders
              }
            })

            this.items = {...items}
            this.pending = false
            this.currentStatus = 'ok'

            if(shouldUpload) {
              s3upload(this.cache)
            }

            console.log('Updated List')
        })
        .catch(err => {
          console.log(err)
          this.pending = false
          this.currentStatus = 'failed'
        })
  }

  getRegionData() {
    return requester({
      chain: empire,
      data: {},
      requester: r => new RegionMarket(r).getData(),
      processor: this.processMarketData,
      limit: regionLimit,
    })
  }

  processMarketData(orderList, oldData) {
    const newData = {...oldData}
    const marketData = [].concat(...orderList)

    marketData.forEach(order => {
      const itemOrder = newData[order.type] || new ItemOrders(order.type)
      const buyOrSell = order.buy ? 'buy' : 'sell'      
      delete order.buy

      itemOrder.orders[buyOrSell].push(order)

      newData[order.type] = itemOrder
    })

    return newData
  }
}