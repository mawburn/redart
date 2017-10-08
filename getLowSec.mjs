import request from 'request'
import fs from 'fs'
import api from './api'

import redoSaved from './redo.json'
import highSec from './highSec.json'
import allSystems from './allSystems.json'

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

let empireSystems = []

const empiresChecked = []

/*regionNames.forEach((region) => {
    request({
        uri: api.searchIt('region', region),
        method: 'GET'
    }, (err, res, body) => {
        const json = JSON.parse(body)
        empireRegions.push(json.region)   
    }) 
})*/




/*empireRegionIds.forEach(region => {
    request({
        uri: api.region.info(region),
        method: 'GET'
    }, (err, res, body) => {
        const json = JSON.parse(body)
        
        if(json.constellations) {
            json.constellations.forEach(c => {
                request({
                    uri: api.constellations(c),
                    method: 'GET'
                }, (error, response, cBody) => {
                    const cStuff = JSON.parse(cBody) 

                    if(cStuff.systems) {
                        empireSystems = empireSystems.concat(cStuff.systems)
                    }
                }) 
            }) 
        }
        
    }) 
})*/

let count = 0

let stations = []
const redo = []

highSec.forEach(system => {
    request({
        uri: api.location.system(system),
        method: 'GET'
    }, (err, res, body) => {
        try {
            const json = JSON.parse(body)

            stations = stations.concat(json.stations) 
            console.log(stations)           
        } catch(error) {
            redo.push(system)
            console.log(error)
        }
    })
})

setTimeout(() => {
    stations.sort((a, b) => a-b)

    fs.writeFile('stations.json', JSON.stringify(stations), (err) => {
        if(err) {
            return console.log(err)
        }

        console.log('done')
    })

    fs.writeFile('redo.json', JSON.stringify(redo), err => {
        if(err) {
            return console.log(err)
        }

        console.log('done')
    })

}, 45000) 


