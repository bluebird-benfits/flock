// Module: Employers
import express from 'express'
import { logEvent } from '../controllers/loggerController.js'
import { addEmployers, findEmployers } from '../controllers/employersController.js'

const router = express.Router()

router.get(`/`, async (req, res) => {
    var data
    var status = 'processing'
    var recordCount = 0
    var httpResponseCode
    try {
        let request = {
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
    const response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    
    return res.status( httpResponseCode ).send( response )
})

router.post(`/`, async (req, res) => {
    var data
    var status = 'processing'
    var httpResponseCode
    var recordCount = 0
    if ( req.body === undefined ) {
        return res.status(400).send( {
            status: 'error',
            message: 'This endpoint requires a JSON-encoded request body.'
        } )
    }
    if ( ! req.body.hasOwnProperty( 'requests' ) ) {
        return res.status(400).send( {
            status: 'error',
            message: 'The body must include a requests property.'
        } )
    }
    if ( ! Array.isArray( req.body.requests )) {
        return res.status(400).send( {
            status: 'error',
            message: 'The requests property must be an array.'
        } )
    }
    if ( req.body.requests.length === 0 ) {
        return res.status(400).send( {
            status: 'error',
            message: 'The requests array cannot be empty'
        })
    }
    try {
        const request = {
            requests: req.body.requests
        }
        const results = await addEmployers( request )
        if ( results.status === 'error' ) {
            data = results.data
            status = 'error'
        } else {
            data = results.data
            recordCount = results.recordCount
            status = 'success'
        }
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        data = error
        status = 'error'
    }
    var response = {
        status: status,
        recordCount: recordCount,
        data: data
    }

    return res.status(200).send( response )
})

router.put(`/:id`, (req, res) => {

})

export default router