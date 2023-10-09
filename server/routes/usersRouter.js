/**
 *   User Router
 */
import express from 'express'
import { addUsers, editUsers, findUsers } from '../controllers/usersController.js'

const router = express.Router()

let body = {}
let status = ''
let statusCode = 0
let processStart = ''
let processEnd = ''
let processDuration = 0
let functionInvoked = ''
let criteria = {}
let results

router.get(`/`, async (req, res) => {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    if ( req.query != undefined ) {
        criteria = req.query
    }

    try {
        results = await findUsers( criteria )
        body = results.toArray()
        status = process.env.API_STATUS_SUCCESS
        statusCode = 200
    } catch ( e ) {
        let error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = { error: error }
        statusCode = 400
    }
    functionInvoked = 'usersRouter.get()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
        functionInvoked: functionInvoked,
        status: status,
        processStart: processStart,
        processEnd: processEnd,
        processDuration: processDuration,
        body: body
    }
    res.status( statusCode ).send( response )
})

router.post(`/`, async (req, res) => {
    
    processStart = Date.now()
    try {
        let results = await addUsers( req.body.requests )
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
    functionInvoked = 'usersRouter.post()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
        functionInvoked: functionInvoked,
        status: status,
        processStart: processStart,
        processEnd: processEnd,
        processDuration: processDuration,
        body: body
    }
    res.status( statusCode ).send( response )

})

router.put('/', async (req, res) => {
    let body = req.body
    // 
    if (body != undefined) {
        let response = await editUsers(parameters)
        res.send(response)
    }
})

export default router