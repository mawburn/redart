const getOrders = fetch('//redart.space/orders').then(data => data.json()).then(json => json.items)
export default getOrders