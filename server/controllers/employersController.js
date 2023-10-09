/**
 * @name employersController
 * @description This module handles 
 * 
 */
import { insert, update, get } from '../models/employerModel.js'

/**
 * 
 * @param { array } employers 
 * @returns 
 */
export async function addEmployers( employers ) {
    try {
        let validation = await validateEmployers( employers )
        if ( validation.status === 'error' ) {
            return {
                statusCode: 400,
                status: 'error',
                errors: {
                    offender: validation.offender,
                    errors: validation.errors
                }
            }
        }
        let addedEmployers = await insert( employers )
        if ( addedEmployers === undefined ) {
            return {
                statusCode: 400,
                status: 'error',
                message: 'There was an error inserting the employers'
            }
        }
        let response = {
            statusCode: 200,
            status: 'success',
            body: addedEmployers
        }
        return response
    } catch ( error ) {
        return error
    }
}

export async function editEmployers( employers ) {

}

export async function findEmployers( criteria ) {
    let foundEmployers = get( criteria )
}

export async function deleteEmployers() {

}

async function validateEmployers( employers ) {
    try {
        let response = {
            status: ''
        }
        if ( ! Array.isArray( employers )) {
            return {
                status: 'error',
                message: 'employerModel.update expects to be passed an array of employer objects'
            }
        }
        if ( employers.length < 1 ) {
            return {
                status: 'error',
                message: 'employerModel.update requires an array with at least one element'
            }
        }
        let errors = []
        employers.forEach( ( employer ) => {
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
                response =  {
                    status: 'error',
                    errors: errors,
                    offender: employer
                }
            } 
        })
        return response

    } catch ( error ) {
        return error
    }
}
