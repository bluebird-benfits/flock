/**
 * Users Controller
 * 
 */

let body = {}
let status = process.env.API_STATUS_PROCESSING
let statusCode = 0
let processStart = Date.now()
let processEnd = ''
let processDuration = 0
let functionInvoked = ''
let criteria = {}
let results

/**
 * 
 * @param { object } users 
 */
export async function addUsers( users ) {

    processStart = Date.now()
    try {
        let validation = validateUsers( users )
        if ( validation.status === 'error' ) {
            error = {
                name: 'User validation error',
                message: 'User validation failed.  See body for details.',
                stack: validation.body
            }
            body = error
            status = process.env.API_STATUS_ERROR
            statusCode = 400
        }
    }  catch ( e ) {
        error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = error
        status = process.env.API_STATUS_ERROR
        statusCode = 400
    }

    if ( status != process.env.API_STATUS_ERROR ) {  // don't run the next block if validation failed
        try {
            results = await insert( users )
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
    }
    functionInvoked = 'usersController.addUsers()'
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
    return response
}
    
export async function editUsers( users ) {

}
/**
 * 
 * @param { object } criteria 
 * @returns { object }
 */
export async function findUsers( criteria ) {

    processStart = Date.now()
    status = process.env.API_STATUS_SUCCESS

    try {
        results = await find( criteria )
        body = results.toArray()
    } catch ( e ) {
        let error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = error
        status = process.env.API_STATUS_ERROR
    }
    functionInvoked = 'userController.findUsers()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
        functionInvoked: functionInvoked,
        status: status,
        statusCode: statusCode,
        processStart: processStart,
        processEnd: processEnd,
        processDuration: processDuration,
        body: results
    }

    return response 
}

export async function deleteUsers( users ) {

}

async function validateUsers( users ) {

    try {
        let response = {
            status: ''
        }
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
                response =  {
                    status: 'error',
                    errors: errors,
                    offender: user
                }
            } 
        })
        response = {
            status: 'success',
            body: users
        }
        return response
    } catch ( error ) {
        return error
    }
}