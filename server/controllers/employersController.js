/**
 * @name employersController
 * @description This module handles 
 * 
 */
import { insert, update, find } from '../utilities/mongodb/wrapper.js'
/**
 * 
 * @param { array } employers 
 * @returns 
 */
export async function addEmployers( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        let validation = await validateEmployers( request )
        console.log(validation)
        if ( validation.status === 'error' ) {
            const error = {
                name: 'Employer validation error',
                message: validation.message,
                stack: validation.errors
            }
            data = error
            status = 'error'
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
    if ( status != 'error' ) {
        try {
            const params = {
                collection: 'employers',
                requests: request.requests
            }
            let results = await insert( params )
            if ( results === undefined ) {
                return {
                    statusCode: 400,
                    status: 'error',
                    message: 'There was an error inserting the employers'
                } 
            } else {
                data = results
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
    }
    let response = {
        status: 'success',
        data: data
    }
    return response
}

export async function editEmployers( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    var updated = []
    var fallout = []
    try {
        const validation = await validateEmployers( request.requests )
        if ( validation.status === 'error' ) {
            const error = {
                name: 'Employer validation error',
                message: validation.message,
                stack: validation.data
            }
            data = error
            status = 'error'
        } else {
            request.requests.forEach( async ( object ) => {
                let filter = { _id : object._id }
                let params = {
                    collection: 'employers',
                    object: object,
                    filter: filter
                }
                const result = await update( params )
                if ( result.body.matchedCount === 0 ) {
                    fallout.push( object._id )
                } else {
                    updated.push( object._id )
                    recordCount += 1
                }
            })
            data = updated
            status = 'success'
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
    var response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    return response
}

export async function findEmployers( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        const params = {
            collection: 'employers',
            criteria: request.criteria,
            options: {}
        }
        const results = await find( params )
        if ( results.status === 'error' ) {
            status = 'error'
            data = results.data
        } else {
            status = 'success'
            data = results.data
            recordCount = data.length
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
    return response
}

async function validateEmployers( request ) {
    let data
    let status = 'processing'
    try {
        if ( ! Array.isArray( request.requests )) {
            return {
                status: 'error',
                message: 'This function expects to be passed an array of employer objects'
            }
        }
        if ( request.requests.length < 1 ) {
            return {
                status: 'error',
                message: 'employerModel.update requires an array with at least one element'
            }
        }
        let errors = []
        request.requests.forEach( ( employer ) => {
            if ( ! employer.hasOwnProperty('name') ) {
                errors.push(`The request must provide a name property.`)
            } else {
                if ( employer.name.length < 3 ) {
                    errors.push(`The company name property must have at least 3 characters`)
                }
                if ( employer.name.length > 75 ) {
                    errors.push('The company name property must have fewer than 75 characters')
                }
            }
            if ( ! employer.hasOwnProperty('ein') ) {
                errors.push('The request must provide an EIN')
            }
            if ( employer.ein.length != 9 ) {
                errors.push('The EIN must consist of 9 digits')
            }
            if ( ! employer.hasOwnProperty('addressOne') ) {
                errors.push('The request must provide a street address.')
            } else {
                if ( employer.addressOne.length  < 8 ) {
                    errors.push('Street address must be at least 8 characters')
                }
                if ( employer.addressOne.length > 50 ) {
                    errors.push('Street address must be fewer than 50 characters')
                }
            }
            if ( ! employer.hasOwnProperty('city') ) {
                errors.push('The request must provide a city property')
            }
            if ( ! employer.hasOwnProperty('state') ) {
                errors.push('The request must provide a state property')
            } else {
                if ( employer.state.length != 2 ) {
                    errors.push('The state property must be the USPS two-character abbreviation')
                }
            }
            if ( ! employer.hasOwnProperty('postalCode') ) {
                errors.push('The request must provide a postal code')
            } else {
                if ( employer.postalCode.length < 5 ) {
                    errors.push('The postal code must be at least 5 characters')
                }
                if ( employer.postalCode.length > 10 ) {
                    errors.push('The postal code must have fewer than 10 characters') // Zip+4 with a hyphen
                }
            } 
            if ( errors.length > 0 ) {
                const error =  {
                    name: 'Employer validation error',
                    errors: errors,
                    offender: employer
                }
                data = error
                status = 'error'
            } 
        })
        if ( status != 'error' ) {
            status = 'success'
        }
        var response = {
            status: status,
            data: data
        }
        return response

    } catch ( error ) {
        return error
    }
}
