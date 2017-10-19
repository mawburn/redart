import fetchApi from './fetchApi'

const bySellStation = stationId => {
  const stations = {}

  return new Promise(resolve => {
    fetchApi.then(orders => {
      Object.keys(orders).forEach(key => {
        orders[key].orders.sell.forEach(b => {
          if(!stationId || stationId === b.location.toString()) {
            stations[b.location] = b
          }
        })
      })

      resolve(stations)
    })
  })  
}

export default bySellStation