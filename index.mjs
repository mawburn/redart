import request from 'request'
import fs from 'fs'
import api from './api'

const marketSell = {}
const done = []

for(let i = 0; i < 15; i++) {
    request({
        uri: api.markets.orders(10000002, 'sell', 15),
        method: 'GET'
    }, (err, res, body) => {
        marketSell[i] = body
        done.push(i)        
    })
}

let count = 0
const checkThem = setInterval(() => {
    if(done.length === 15) {
        fs.writeFile('test.json', JSON.stringify(marketSell), (err) => {
            clearTimeout(checkThem)

            if(err) {
                return console.log(err)
            }

            console.log(`done - ${count/2} seconds`)
        })
    }

    if(count > 240) {
        clearTimeout(checkThem)
    }
    
}, 500)