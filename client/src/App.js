import React, {Component} from 'react'
import './App.css'
import Station from './components/Station'
import getOrders from './utils/fetchApi'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sell: [],
      buy: [],
    }
  }

  componentDidMount() {
    getOrders.then(orders => {
      this.setState({sell: orders.sell, buy: orders.buy})
    }) 
  }

  render() {
    const sellOrders = this.state.sell
    const buyOrders = this.state.buy

    return (
      <div className="App">
        {Object.keys(sellOrders).map(station => {
          return (
            <div>
              <Station id={station} />
              <ul>
              {sellOrders[station].map((order, i) => {
                return (
                  <li key={`${order.type} ${order.price} ${i}`}>
                    Type: {order.type} - Price: {order.price} - Amount: {order.sellAmt}
                    <ul>
                      {buyOrders[order.type].map((buyOrder, i) => {
                        return (
                          <li key={`${buyOrder.price} ${i} ${buyOrder.loc}`}>
                            <Station id={String(buyOrder.loc)} />
                            Price: {buyOrder.price} - Amount: {buyOrder.buyAmt}
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              })}
              </ul>
            </div>
          )
        })}
      </div>  
    )
  }
}

export default App 
