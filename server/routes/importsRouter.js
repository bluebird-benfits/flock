/**
 *  Imports Router
 */
import express from 'express'
import { executeInitialImportProcess } from '../controllers/importsController.js'

const router = express.Router()

// This will be called from the client after authentication
router.post(`/`, async (req, res) => {
    if ( req.body === undefined ) {
        return res.status(400).send( {
            status: 'error',
            message: 'This endpoint requires a JSON-encoded request body.'
        } )
    }
    if ( ! req.body.hasOwnProperty('request')) {
        return res.status(400).send( {
            status: 'error',
            message: 'This body must contain a request property.'
        } )
    }
    if ( ! req.body.request.hasOwnProperty('companyId')) {
        return res.status(400).send( {
            status: 'error',
            message: 'This endpoint requires a company id.'
        } )
    }
    let dataImport = await executeInitialImportProcess()
   
    res.send(dataImport)
})

export default router