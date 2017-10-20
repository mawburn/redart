import fetchApi from './fetchApi'

const bySellStation = stationId => {
  const stations = {}

  return new Promise(resolve => {
    fetchApi.then(itemList => {
      const keys = Object.keys(itemList)

      keys.forEach(key => {
        let sell =  itemList[key].orders.sell 

        if(stationId) {
          sell = sell.filter(order => order.location.toString() === stationId)
        }

        sell.forEach(order => {
          if(!stations[order.location]) {
            stations[order.location] = {}
          }

          const stationOrders = stations[order.location].sell || []

          const newOrder = {...order}
          delete newOrder.location
          delete newOrder.range
          
          stationOrders.push(newOrder)

          stations[order.location].sell = stationOrders
        })
      })

      resolve(stations)
    })
  })  
}

export default bySellStation