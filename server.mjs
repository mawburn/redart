import express from 'express'
import getData from './src'

const app = express()

app.get('/', (req, res) => {
    getData().then(data => res.send(data)).catch(err => res.send(err))
})

app.listen(3000, () => {
    console.log('Running on port 3000')
})