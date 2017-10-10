import express from 'express'
import getData from './src'

const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
    getData().then(data => res.send(data)).catch(err => res.send(err))
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})