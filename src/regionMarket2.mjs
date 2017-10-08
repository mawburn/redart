import request from 'request-promise-native'
import bs from 'binary-search'
import moment from 'moment'
import api from './api'
import highSecStations from '../eveData/highSecStations'


class RegionOrders {
    constructor(region) {
        super()

        this.region = region
        this.filterHighSec = this.filterHighSec.bind(this)
    }

    requestOpts(region, page) {
        return {
            uri: api.market.orders(region, page),
            method: 'GET',
            json: true,
            transform: ((body, response, resolveWithFullResponse) => {
                return { 'headers': response.headers, body}
            }) 
        }
    }

    orderFormat(order) {
        return {
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
            ends,  
        }
    }

    filterHighSec(orders, curDate) {
        return orders.map(order => {
            const isHighSec = bs(highSecStations, order['location_id'], (a,b) => a-b)

            if(isHighSec) {
                const ends = moment(order.issued).add(order.duration, 'days').utc().format()
                return this.orderFormat(order, ends)
            }
        })
    }

    splitOrders(orders) {
        const buy = orders.filter(order => order.buy)
        const sell = orders.filter(order => !order.buy)

        return {buy, sell}
    }
}


const options = (region, page) => {
    return {
        uri: api.market.orders(region, page),
        method: 'GET',
        json: true,
        transform: ((body, response, resolveWithFullResponse) => {
            return { 'headers': response.headers, body}
        }) 
    }
} 

const regionOrders = (region, highSec = false) => {
    return new Promise((resolve, reject) => {
        const orders = []

        orders.push(getMarket(region, 1))

        orders[0].then(response => {
            const pages = response.headers['x-pages']
            const curDate = moment(response.headers.date)

            for(let i = 2; i <= pages; ++i) {
                orders.push(getMarket(region, i))
            }

            Promise.all(orders)
                .then(values => {
                    const highSecOrders = values.map(page => {
                        return filterHighSecStations(page.body, curDate)
                    })

                    const orders = [].concat(...highSecOrders)

                    const buyOrders = orders.filter(order => order.buy)
                    const sellOrders = orders.filter(order => !order.buy)

                    resolve({buy: buyOrders, sell: sellOrders})
                })
        })
    }) 
} 

const newOrder = (order, ends) => {
    return {
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
        ends,  
    }
}

const filterHighSecStations = (orders, curDate) => {
    return orders.map(order => {
        const isHighSec = bs(highSecStations, order['location_id'], (a,b) => a-b)

        if(isHighSec) {
            const ends = moment(order.issued).add(order.duration, 'days').utc().format()
            return newOrder(order, ends)
        }
    })
}

const getMarket = (region, page) => {
    return request(options(region, page))
}

export default regionOrders