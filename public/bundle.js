const app = document.getElementById('app')

let count = 0

const getOrders = (count = 0) => {
  return fetch('./orders')
    .then(res => {
      if(res.statusCode !== 200 && res.statusCode < 300) {
        return undefined
      }
      return res.json()
    })
    .catch(err => console.error())
}

const printOrders = () => {
  ++count
  const output = []

  getOrders()
    .then(orders => {
      if(!orders) {
        app.innerHTML = `<div style="text-align:center">Waiting: ${count}</div>`
        setTimeout(printOrders, 1000)
      } else {
        Object.keys(orders).forEach(key => {
          if(key !== 'expires' && key !== 'pending') {
            const o = orders[key]
            output.push(`<div style="padding:0.5rem"><strong>${o.name}</strong> : Vol (${o.mass}) : Sell (${o.orders.sell.length}) : Buy (${o.orders.buy.length})</div>`)
          }
        })
        app.innerHTML = output.join('')
      }
    }).catch(err => console.error(err))
}

printOrders()