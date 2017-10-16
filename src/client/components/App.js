import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'
import Login from '../containers/Login'

import styles from './app.styl'

class App extends Component {
  render() {
    return ( 
      <Grid className={styles.container}>
        <Row>
          <Col xs={12}>
            <Login />
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default App