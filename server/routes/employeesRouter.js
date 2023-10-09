// Module: Employees Router
import express from 'express'
import { addEmployees, editEmployees, findEmployees} from '../controllers/employeesController.js'
import { MongoExpiredSessionError } from 'mongodb'

const router = express.Router()

let body = {}
let status = process.env.API_STATUS_PROCESSING
let statusCode = 0
let processStart = Date.now()
let processEnd = ''
let processDuration = 0
let functionInvoked = ''
let results

router.get(`/`, async (req, res) => {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    try {
        results = await findEmployees( req.query )
        body = results
        status = process.env.API_STATUS_SUCCESS
        statusCode = 200
    } catch ( e ) {
        error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = error
        status = process.env.API_STATUS_ERROR
        statusCode = 400
    }

    functionInvoked = 'employeesRouter.get()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
        functionInvoked: functionInvoked,
        status: status,
        statusCode: statusCode,
        processStart: processStart,
        processEnd: processEnd,
        processDuration: processDuration,
        body: body
    }
    return res.status( statusCode ).send( response )

})

router.post(`/`, async (req, res) => {
    console.log('router')
    let employees = await addEmployees( req.body )
    res.send( employees )
})

router.put(`/`, async (req, res) => {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    try {
        results = await editEmployees( req.body )
        body = results
        status = process.env.API_STATUS_SUCCESS
        statusCode = 200
    } catch ( e ) {
        error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = error
        status = process.env.API_STATUS_ERROR
        statusCode = 400
    }

    functionInvoked = 'employeesRouter.put()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
        functionInvoked: functionInvoked,
        status: status,
        statusCode: statusCode,
        processStart: processStart,
        processEnd: processEnd,
        processDuration: processDuration,
        body: body
    }
    return res.status( statusCode ).send( response )
})

export default router