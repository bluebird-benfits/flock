// Module: Employees Router
import express from 'express'
import { addEmployees, editEmployees, findEmployees} from '../controllers/employeesController.js'
import { responseObject } from '../utilities/http/response.js'

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
    const response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    
    return res.status( httpResponseCode ).send( response )
})

router.post(`/`, async (req, res) => {
    let data
    let status = 'processing'
    let httpResponseCode
    let recordCount = 0
    try {
        let results = await addEmployees( req.body )
        if ( results.status === 'error' ) {
            status = 'error'
            httpResponseCode = 400
        } else {
            status = 'success'
            httpResponseCode = 200
            recordCount = results.recordCount
        }
        data = results.data
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
    const response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    res.status( httpResponseCode ).send( response )
})

router.put(`/`, async (req, res) => {
    let data
    let status = 'processing'
    let httpResponseCode
    let recordCount = 0
    try {
        let results = await editEmployees( req.body )
        if ( results.status === 'error' ) {
            status = 'error'
            httpResponseCode = 400
        } else {
            status = 'success'
            httpResponseCode = 200
        }
        data = results.data
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
    res.status( httpResponseCode ).send ( response )
})

export default router