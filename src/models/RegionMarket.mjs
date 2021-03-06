import request from 'request-promise-native'
import moment from 'moment'
import Order from './Order'
import requester from '../util/requester'
import esi from '../util/esiEndpoints'

const pageLimit = process.env.PAGE_LIMIT || 100

export default class RegionMarket {
  constructor(region) {
    this.id = region

    this.options = this.options.bind(this)
    this.getData = this.getData.bind(this)
    this.getPage = this.getPage.bind(this)
  } 

  options(page) {
    return {
      uri: esi.market.orders(this.id, page),
      method: 'GET',
      json: true,
      transform: ((body, response) => {
        return {headers: response.headers, body}
      }),
    }
  }

  getMarketData(chain) {
    return requester({
      chain,
      data: [],
      requester: page => this.getPage(page),
      processor: x => [].concat(...x),
      limit: pageLimit,
    })
  }

  getData() {
    console.log(`get region: ${this.id}`)
    return this.getMarketData([1]).
      then(data => {
        if(this.pages < 2) {
          return [].concat(...data)
        }

        const chain = []

        for(let i = 2; i <= this.pages; i++) {
          chain.push(i)
        }

        // console.log(`get pages ${JSON.stringify(chain)} of ${this.id}`)

        return this.getMarketData(chain)
          .then(data => [].concat(...data))
      })
  }

  getPage(page) {
    return request(this.options(page))
      .then(response => {
        this.pages = this.pages || response.headers['x-pages']
        this.expires = this.expires || moment(response.headers.expires).utc().format()

        return response.body
          .map(rawOrder => new Order(rawOrder))
          .filter(o => o.type)
      })
  }
}
