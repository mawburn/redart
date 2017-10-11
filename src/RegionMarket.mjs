import request from 'request-promise-native'
import moment from 'moment'
import Order from './Order'
import requester from './requester'
import api from './api'
import fs from 'fs'

export default class RegionMarket {
    constructor(region) {
        this.id = region

        this.options = this.options.bind(this)
        this.getData = this.getData.bind(this)
        this.getPage = this.getPage.bind(this)
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

    getMarketData(chain) {
        return requester({
            chain,
            data: [],
            requester: (p) => this.getPage(p),
            processor: (x) => {
                const concatted = [].concat(...x)
                const rand = Math.random() * (10000 - 1) + 1
                fs.writeFile(`./tmp/x${rand}`, JSON.stringify(concatted))
                return [].concat(...x)
            },
            limit: 5,
        })
    }

    getData() {
        console.log(`get page 1 of ${this.id}`)
        return this.getMarketData([1]).
            then(data => {
                if(this.pages < 2) {
                    return [].concat(...data)
                }

                const chain = []

                for(let i=2; i <= this.pages; i++) {
                    chain.push(i)
                }

                console.log(`get pages ${JSON.stringify(chain)} of ${this.id}`)

                return this.getMarketData(chain)
                    .then(data => {
                        return [].concat(...data)
                    })
            })
    }

    getPage(page) {
        return request(this.options(page))
                .then(response => {
                    this.pages = this.pages || response.headers['x-pages']
                    this.expires = this.expires || moment(response.headers.expires).utc().format()

                    return response.body.map(rawOrder => {
                        const order = new Order(rawOrder)
                        const shouldReturn = order.highSec && order.legal && (!order.buy || order.price > 3)
                        return shouldReturn ? order : undefined
                    }).filter(o => o)
                })
    }
}
