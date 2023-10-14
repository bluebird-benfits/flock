/**
 * Users Controller
 * 
 */
import { insert, update, find } from '../utilities/mongodb/wrapper.js'
import bcrypt from 'bcrypt'

/**
 * 
 * @param { object } users 
 */
export async function addUsers( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        let validation = await validateUsers( request.requests )
        if ( validation.status === 'error' ) {
            const error = {
                name: 'User validation error',
                message: validation.message,
                stack: validation.body
            }
            data = error
            status = 'error'
        }
    }  catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        data = error
        status = 'error'
    }
    if ( status != 'error' ) {  // don't run the next block if validation failed
        try {
            const params = {
                collection: 'users',
                requests: request.requests
            }
            const results = await insert( params )
            data = results
            status = 'success'
        } catch ( e ) {
            const error = {
                name: e.name,
                message: e.message,
                stack: e.stack
            }
            data = error
            status = 'error'
        }
    }
    var response = {
        status: status,
        recordCount: recordCount,
        data: data,
    }
    return response
}
    
export async function editUsers( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    var updated = []
    var fallout = []
    try {
        const validation = await validateUsers( request.requests )
        if ( validation.status === 'error' ) {
            const error = {
                name: 'User validation error',
                message: validation.message,
                stack: validation.data
            }
            data = error
            status = 'error'
        } else {
            request.requests.forEach( async ( object ) => {
                const filter = { _id: object.id }
                const params = {
                    collection: 'users',
                    object: object,
                    filter: filter
                }
                const result = await update( params )
                if ( result.body.matchedCount === 0 ) {
                    fallout.push( object._id )
                } else {
                    update.push( object._id )
                    recordCount += 1
                }
            })
            data = updated
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
    const response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    return response
}
/**
 * 
 * @param { object } criteria 
 * @returns { object }
 */
export async function findUsers( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        const params = {
            collection: 'users',
            criteria: request.criteria,
            options: {}
        }
        const results = await find( params )
        if ( results.status === 'error' ) {
            status = 'error'
            data = results.data
        }
        status = 'success'
        data = results.data
        recordCount = data.length
    } catch ( e ) {
        let error = {
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
    return response 
}


async function validateUsers( users ) {
    var data
    var status = 'processing'
    try {
        // Confirm the input parameter is an array with at least one element
        if ( ! Array.isArray( users )) {
            return {
                status: 'error',
                message: 'The function must be passed an array of user objects.'
            }
        }
        if ( users.length < 1 ) {
            return {
                status: 'error',
                message: 'The input array must have at least one element.'
            }
        }
        // Validate each employee in the array
        let errors = []
        users.forEach( ( user ) => {
            if ( ! user.hasOwnProperty( 'firstName' )) {
                errors.push('The request must provide a first name property')
            } else {
                if ( user.firstName.length < 2 ) {
                    errors.push('The first name property must have at least 3 characters')
                }
                if ( user.firstName.length > 20 ) {
                    errors.push('The first name property must have fewer than 75 characters')
                }
            }
            if ( ! user.hasOwnProperty( 'lastName' ) ) {
                errors.push('The request must provide a last name property.')
            } else {
                if ( user.lastName.length < 2 ) {
                    errors.push('The last name property must have at least 3 characters')
                }
                if ( user.lastName.length > 20 ) {
                    errors.push('The last name property must have fewer than 75 characters')
                }
            }
            if ( ! user.hasOwnProperty( 'emailAddress' )) {
                errors.push('The request must provide an email address property')
            } else {
                let validateEmail = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
                try {
                    if ( ! validateEmail.test( user.emailAddress )) {
                        console.log('bad email')
                        errors.push('The email address is not properly formatted.')
                    }
                } catch ( error ) {
                    return error
                }
            }
            if ( errors.length > 0 ) {  // return after the first user that fails validation
                const error =  {
                    status: 'error',
                    errors: errors,
                    offender: user
                }
                status = 'error'
                data = error
            } 
        })
        status = 'success'
        var response = {
            status: status,
            data: data
        }
        return response
    } catch ( error ) {
        return error
    }
}