import fs from 'fs'
import RegionMarket from './RegionMarket'

const forge = new RegionMarket('10000002')

forge.getData()
    .then(data => {
        const orders = JSON.stringify(data)

        fs.writeFile(`./tmp/${forge.id}.json`, orders, err => {
            if(err) {
                return console.log(err)
            }
        })
    })
    .catch(err => console.log(err))