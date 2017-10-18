import React, {Component} from 'react'
import logo from './logo.svg'
import './App.css'
import fetchApi from './util/fetchApi'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    fetchApi.then(data => {
      this.setState({orders: data})
    })
  }

  renderOrders(orders) {
    if(orders) {
      return Object.keys(orders).map((key, i) => {
        const item = orders[key]
        return (
          <li key={`${item.name} - ${i}`}>
            <h4>{item.name} - {item.vol}</h4>
            Buy:
            <ul>
              {
                item.orders.buy.map((order, i) => <li key={`${order.price}-${i}`}>{order.price} - {order.volume.remain}</li>)
              }
            </ul>
            Sell:
            <ul>
              {
                item.orders.sell.map((order, i) => <li key={`${order.price}-${i}`}>{order.price} - {order.volume.remain}</li>)
              }
            </ul>
          </li>
        )
      })
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <ul className="main-list">
          {this.renderOrders(this.state.orders)}
        </ul>
      </div>  
    )
  }
}

export default App 
