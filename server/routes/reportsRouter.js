/**
 *   Reports Router
 */

import express from 'express'
import { addReports, editReports, getReports } from '../controllers/reportsController.js'

const router = express.Router()

router.get(`/`, async (req, res) => {
    let parameters = req.query
    if (Object.keys(parameters).length > 0) {
        console.log(parameters)
        parameters.forEach((parameter) => {
            // validate the provided parameters
        })
    let response = addReports()
    res.send(response)
    }
})

router.post(`/`, (req, res) => {
    let parameters = req.body
    res.send(`creating a new report`)
})

router.put('/', async (req, res) => {
    res.send('updating a report')
})

export default router