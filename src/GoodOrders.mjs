import moment from 'moment'
import processOrders from './processOrders'
import s3upload from './s3upload'

export default class GoodOrders {
  constructor() {
    this.expires = moment().utc().format()
    this.pending = false
    this.items = {}
    this.intervalCount = 300 * 1000
  }

  get cache() { 
    return {
      expires: this.expires,
      pending: this.pending,
      items: this.items, 
    }
  }

  update(count = 0) {
    if(!this.pending) {
      this.expires = moment().add(300, 'seconds').utc().format()
      this.getItems()
    } else if(count < 100) {
      setTimeout(() => this.update(count + 1), 1000)
    } else {
      clearInterval(this.updater)
      console.log('Error with updater. Still pending after 100 seconds')
    }
  }
   
  startUpdater() {
    this.update()
    this.updater = setInterval(() => this.update(), this.intervalCount) 
  } 

  stopUpdater() {
    clearInterval(this.updater)
  } 

  getItems() {
    this.pending = true

    processOrders()
      .then(data => {  
        this.items = data
        this.pending = false

        s3upload(this.cache)
        console.log('done')
      }) 
  }
}