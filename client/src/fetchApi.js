const getOrders = fetch('//redart.space/orders').then(data => data.json())
export default getOrders