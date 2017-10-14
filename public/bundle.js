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

      if(!items && orders.pending) {
        app.innerHTML = `<div style="text-align:center">Waiting: ${count}</div>`
        setTimeout(printOrders, 1000)
      } else {
        app.innerHTML = `Total Items: ${Object.keys(items).length - 2}`

        Object.keys(items).forEach(key => {
          if(key !== 'expires' && key !== 'pending') {
            const item = items.key
            output.push(`<div style="padding:0.5rem"><strong>${item.name}</strong> : Vol (${item.mass}) : Sell (${item.orders.sell.length}) : Buy (${item.orders.buy.length})</div>`)
          }
        })
        app.innerHTML = app.innerHTML + output.join('')
      }
    }).catch(err => console.error(err))
}

printOrders()
