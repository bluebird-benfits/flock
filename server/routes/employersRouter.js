/**
 *   Employers Router
 */
import express from 'express'
import { addEmployers, editEmployers, findEmployers } from '../controllers/employersController.js'

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
        const results = await findEmployers( request )
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
    res.status( httpResponseCode ).send( response )
})

router.post(`/`, async (req, res) => {
    try {
        const request = {
            requests: req.body.requests
        }
        const results = await addEmployers( request )
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
        data = error
        status = 'error'
        httpResponseCode = 400
    }
    response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    res.status( httpResponseCode ).send( response )
})

router.put('/', async (req, res) => {
    if ( req.body === undefined ) {
        const error = {
            name: 'Malformed Request Error',
            message: 'The request must have a body.'
        }
        status = 'error'
        httpResponseCode = 400
        response = {
            status: status,
            recordCount: recordCount,
            data: error
        }
        res.status( httpResponseCode ).send( response )
    }
    try {
        const request = {
            requests: req.body
        }
        const results = await editEmployers( request )
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
    res.status( httpResponseCode ).send( response )
})

export default router