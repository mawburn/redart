import bs from 'binary-search'
import moment from 'moment'
import highSecStations from '../eveData/highSecStations'

export default class Order {
    constructor(order) {
        const highSec = bs(highSecStations, this.id, (a,b) => a-b) > -1
        const ends = moment(order.issued).add(order.duration, 'days').utc().format()

        Object.assign(this, {
            id: order['order_id'],
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
        })
    }
}