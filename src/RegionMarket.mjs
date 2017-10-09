import request from 'request-promise-native'
import moment from 'moment'
import Order from './Order'
import api from './api'

export default class RegionMarket {
    constructor(region) {
        this.id = region

        this.options = this.options.bind(this)
        this.getData = this.getData.bind(this)
    }

    options(page) {
        return {
            uri: api.market.orders(this.id, page),
            method: 'GET',
            json: true,
            transform: ((body, response, resolveWithFullResponse) => {
                return { 'headers': response.headers, body}
            }) 
        }
    }

    getData() {
        return new Promise((resolve, reject) => {
            const orderPromises = []

            orderPromises.push(this.getPage(1))

            orderPromises[0]
                .then(response => {
                    this.pages = response.headers['x-pages']
                    this.expires = moment(response.headers.expires).utc().format()

                    for(let i = 2; i <= this.pages; i++) {
                        orderPromises.push(this.getPage(i))
                    }

                    Promise.all(orderPromises)
                        .then(values => {
                            const pages = values.map(page => {
                                return page.body.map(rawOrder => {
                                    const order = new Order(rawOrder)

                                    if(order.highSec && (!order.buy || order.price > 3)) {
                                        return order
                                    }
                                })
                            })

                            const orders = [].concat(...pages).filter(o => o)

                            resolve(orders)
                        })
                        .catch(err => console.log(err))
                })
        })        
    }

    getPage(page, count = 0) {
        return request(this.options(page))
            .catch(() => {
                if(count < 5) {
                    return this.getPage(page, ++count)
                }

                console.log(`Couldn't get ${this.region} - page ${page}`)
            })
    }
}
