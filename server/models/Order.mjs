import bs from 'binary-search'
import moment from 'moment'
import highSecStations from '../../eveData/highSecStations'
import ignoredItems from '../../eveData/ignoredItems'

export default class Order {
  constructor(order) {
    const type = order.type_id
    const loc = order.location_id
    const buy = order.is_buy_order
    const price = order.price
    const ends = moment(order.issued).add(order.duration, 'days').utc().format()

    if(this.isTradable(buy, price, type, location, ends)) {
      Object.assign(this, {
        buy,
        price,
        volume: {
          total: order.volume_total,
          remain: order.volume_remain,
          min: order.min_volume,
        },
        range: order.range,
        location,
        ends,
      })
    }
  } 
 
  isHighSec(loc) {
    return bs(highSecStations, loc, (a,b) => a - b) > -1
  }

  shouldIgnore(item) {
    return bs(ignoredItems, item, (a, b) => a - b) < 0
  }

  isTradable(buy, price, item, loc, time) {
    return (!buy || price > 1.5) && // if a sell order over 1
      this.shouldIgnore(item) &&
      this.isHighSec(loc) &&
      moment().add(20, 'minutes').isBefore(time)
  }
}