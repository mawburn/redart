
export default class ItemOrders {
    constructor(item) {
        this.id = item
        this.orders = {
            sell: [],
            buy: [],
        }
    }
}