/**
 *   Authorization Controller
 */
import bcrypt from 'bcrypt'
import { findUsers } from '../controllers/usersController.js'

var response
var data
var status = 'processing'
var recordCount = 0

export async function createToken() {
    return {
        status: 'success',
        recordCount: 0,
        data: {
            name: 'Token Created'
        }
    }
}

export async function retrieveToken() {
    return {
        status: 'success',
        recordCount: 0,
        data: {
            name: 'Token Retrieved'
        }
    }
}

export async function authorize( request ) {
    const params = {
        criteria:{ emailAddress: request.requests.username }
    }
    const results = await findUsers( params )
    if ( results ) {
        const hash = results.data[0].passwordHash  // findUsers returns an array of matches; here we know that there can only be one
        const authorize = await bcrypt.compare(request.requests.password, hash)
        if ( authorize ) {
            data = results.data[0]
            recordCount = results.recordCount
            status = 'success'
        } else {
            const error = {
                name: 'Authentication error',
                message: 'The username or password was incorrect.'
            }
            data = error
            status = 'error'
        }
    } else {
        const error = {
            name: 'Username not found error',
            message: 'The username provided could not be found.'
        }
        status = 'error'
        data = error
    }
    response = {
        status: 'success',
        recordCount: recordCount,
        data: data
    }
    return response
}