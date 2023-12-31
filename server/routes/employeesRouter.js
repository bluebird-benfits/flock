// Module: Employees Router
import express from 'express'
import { addEmployees, editEmployees, findEmployees} from '../controllers/employeesController.js'

const router = express.Router()

var response                // object containing the function response
var data                    // response property holding the employer data returned, if applicable
var status = 'processing'   // response property holding the process status  
var recordCount = 0         // response property holding the number or records affected 
var httpResponseCode        // property holding the Http status code

router.get(`/`, async (req, res) => {
    try {
        const request = {
            criteria: req.query
        }
        const results = await findEmployees( request )
        data = results.data
            recordCount = results.recordCount
            status = 'success'
            httpResponseCode = 200
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        data = error
        status = 'error'
        httpResponseCode = 400
    }
    response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    return res.status( httpResponseCode ).send( response )
})

router.post(`/`, async (req, res) => {
    try {
        const request = {
            requests: req.body.requests
        }
        const results = await addEmployees( request )
        if ( results.status === 'error' ) {
            status = 'error'
            httpResponseCode = 400
        } else {
            status = 'success'
            data = results.data
            recordCount = results.recordCount
            httpResponseCode = 200
        }
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        data = error,
        status = 'error',
        httpResponseCode = 400
    }
    response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    res.status( httpResponseCode ).send( response )
})

router.put(`/`, async (req, res) => {
    try {
        const request = {
            requests: req.body
        }
        let results = await editEmployees( request )
        if ( results.status === 'error' ) {
            status = 'error'
            httpResponseCode = 400
        } else {
            data = results.data
            status = 'success'
            httpResponseCode = 200
        }
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        data = error
        status = 'error'
        httpResponseCode = 400
    }
    response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    res.status( httpResponseCode ).send ( response )
})

export default router