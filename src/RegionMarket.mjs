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
                    for(let i = 2; i <= this.pages; i++) {
                        orderPromises.push(this.getPage(i))
                    }

                    Promise.all(orderPromises)
                        .then(pages => {
                            const regionOrders = [].concat(...pages).filter(p => p)
                            resolve(regionOrders)
                        })
                        .catch(err => console.log(err))
                }).catch(err => console.log(err))
        })        
    }

    getPage(page, count = 0) {
        return new Promise((resolve, reject) => {
            request(this.options(page))
                .then(response => {
                    this.pages = this.pages || response.headers['x-pages']
                    this.expires = this.expires || moment(response.headers.expires).utc().format()

                    const page = response.body.map(o => {
                        const order = new Order(o)
                        const shouldReturn = order.highSec && order.legal && (!order.buy || order.price > 3)

                        return shouldReturn ? order : undefined
                    }).filter(o => o)

                    resolve(page)
                })
                .catch(err => {
                    if(count < 15) {
                        return this.getPage(page, ++count)
                    }

                    reject(err)
                })
        })
    }
}
