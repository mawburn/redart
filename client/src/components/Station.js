import React, {Component} from 'react'
import PropTypes from 'prop-types'
import esi from '../utils/esiEndpoints'

export default class Station extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: '',
    }
  }

  componentWillMount() {
    fetch(esi.location.station(this.props.id), {headers: {Accept: 'application/json'}})
      .then(response => response.json())
      .then(json => {
        this.setState({name: json.name})
      })
  }

  render() {
    console.log(this.props.orders)
    return (
      <div>{this.state.name}</div>,
      <ul>
        <li></li>
      </ul>
    )
  }
}

Station.propTypes = {
  id: PropTypes.string.isRequired,
  orders: PropTypes.object.isRequired,
}