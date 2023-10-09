// Module: Employers
import express from 'express'
import { logEvent } from '../controllers/loggerController.js'
import { addEmployers } from '../controllers/employersController.js'

const router = express.Router()

router.get(`/`, (req, res) => {
    if ( req.body != undefined ) {
        return res.status(400).send( {
            status: 'error',
            message: 'This endpoint does not allow a body in the request'
        })
    }

    res.send(`hello employers`)
})

router.post(`/`, async (req, res) => {
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
    let employers = req.body.requests
    let response = await addEmployers( employers )
    return res.status(response.statusCode).send( response )
})

router.put(`/:id`, (req, res) => {

})

export default router