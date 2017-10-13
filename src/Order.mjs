import bs from 'binary-search'
import moment from 'moment'
import highSecStations from '../eveData/highSecStations'
import illegalGoods from '../eveData/illegalGoods'

export default class Order {
  constructor(order) {
    const highSec = bs(highSecStations, order['location_id'], (a,b) => a-b) > -1
    const legal = bs(illegalGoods, order['type_id'], (a, b) => a-b) < 0
    const ends = moment(order.issued).add(order.duration, 'days').utc().format()

    Object.assign(this, {
      type: order['type_id'],
      buy: order['is_buy_order'],
      volume: {
        total: order['volume_total'],
        remain: order['volume_remain'],
        min: order['min_volume'],
      },
      price: order.price,
      range: order.range,
      location: order['location_id'],
      highSec,
      ends,
      legal,
    })
  }
}