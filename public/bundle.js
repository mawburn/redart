const app = document.getElementById('app')

let count = 0

const getOrders = () => fetch('./orders')
  .then(res => {
    if(res.statusCode !== 200 && res.statusCode < 300) {
      return undefined
    }
    return res.json()
  })
  .catch(err => console.error(err))


const printOrders = () => {
  ++count
  const output = []

  getOrders()
    .then(orders => {
      const items = orders.items

      if(orders.pending) {
        app.innerHTML = `<div style="text-align:center">Waiting: ${count}</div>`
        setTimeout(printOrders, 1000)
      } else {
        Object.keys(items).forEach(key => {
          if(key !== 'expires' && key !== 'pending') {
            const item = items[key]
            output.push(`<div style="padding:0.5rem"><strong>${item.name}</strong> : Vol (${item.vol}) : Sell (${item.orders.sell.length}) : Buy (${item.orders.buy.length})</div>`)
          }
        })
        app.innerHTML = output.join('')
      }
    }).catch(err => console.error(err))
}

printOrders()