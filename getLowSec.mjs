import request from 'request'
import api from './api'

const empireRegions = []

const regionNames = [
    'Amarr Empire',
    'Aridia',
    'The Bleak Lands',
    'Devoid',
    'Domain',
    'Kador',
    'Kor-Azor',
    'Tash-Murkon',
    'Ammatar Mandate',
    'Derelik',
    'Caldari State',
    'Black Rise',
    'The Citadel',
    'The Forge',
    'Lonetrek',
    'Gallente Federation',
    'Essence',
    'Everyshore',
    'Placid',
    'Sinq Laison',
    'Solitude',
    'Verge Vendor',
    'Genesis',
    'Khanid Kingdom',
    'Khanid',
    'Minmatar Republic',
    'Heimatar',
    'Metropolis',
    'Molden Heath'
]

const empireRegionIds = [
    10000042,
    10000030,
    10000049,
    10000028,
    10000036,
    10000020,
    10000052,
    10000065,
    10000001,
    10000037,
    10000068,
    10000002,
    10000038,
    10000054,
    10000043,
    10000033,
    10000069,
    10000064,
    10000016,
    10000044,
    10000032,
    10000048,
    10000067,
]


regionNames.forEach((region) => {
    request({
        uri: api.searchIt('region', region),
        method: 'GET'
    }, (err, res, body) => {
        const json = JSON.parse(body)
        empireRegions.push(json.region)   
    }) 
})

const interval = setInterval(() => {
    if(empireRegions.length === regionNames.length) {
        console.log(empireRegions)
        clearInterval(interval)
    }
}, 250)
