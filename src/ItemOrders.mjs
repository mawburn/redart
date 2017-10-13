import itemInfo from '../eveData/itemInfo'

export default class ItemOrders {
  constructor(item) {
    if(itemInfo[item]) {
      this.vol = itemInfo[item].vol
      this.name = itemInfo[item].name
    } else {
      console.log(`Can't find item: ${item}`)
    }

    this.orders = {
      sell: [],
      buy: [],
    }
  }

  static filterByProfit(order, margin) {
    if(order && order.orders.sell.length === 0 || order.orders.buy.length === 0) {
      return undefined
    }

    const marginPercent = margin/100
    const sell = order.orders.sell.sort((a, b) => a.price - b.price)
    const buy = order.orders.buy.sort((a, b) => b.price - a.price)

    const sellLowest = sell[0].price * (marginPercent + 1)
    const buyMax = buy[0].price

    if(sellLowest < buyMax) {
      const buyOrders = buy.filter(order => order.price > sellLowest)
      const sellOrders = sell.filter(order => order.price < buyMax)

      return {
        ...order,
        orders: {
          buy: buyOrders,
          sell: sellOrders
        }
      }
    }
  }
}
