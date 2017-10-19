import React, {Component} from 'react'
import './App.css'
import Station from './components/Station'
import ordersBySellStation from './utils/ordersBySellStation'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    ordersBySellStation('60003760').then(stations => {
      this.setState({stations})
    })
  }

  render() {
    const stations = this.state.stations

    return (
      <div className="App">
        {stations && Object.keys(stations).map(id => <Station id={id} orders={stations[id]} key={id} />)}
      </div>  
    )
  }
}

export default App 
