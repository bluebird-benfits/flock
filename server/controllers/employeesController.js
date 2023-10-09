/**
 * Module: Employees Controller
 * @description This module is the controller handling all requests related to employee records
 */
import { insert, update, find } from '../models/employeeModel.js'
import { sendHttpRequest } from '../utilities/http/http.js'

let body
let error
let status
let statusCode
let processStart
let processEnd
let processDuration
let functionInvoked
let results

/**
 * TO-DO:
 *   - Add database connection timeout error handling/retry logic
 *   - Refactor logging to use an EventEmitter
 *     - Endpoint hit
 *     - Function invoked
 *     - Errors
 *     - Response
 *     - Http requests
 *     - Database Connections
 *   - Refactor the custom Response object to reflect parent/children processes
 *   - Add API authentication flow for inbound requests from the client
 */
/**
 * 
 * @description This is the main function orchestrating the data import of employee profiles
 */
export async function buildEmployeeProfiles() {
    try {
        let profilesList = []
        let employee = {}
        let directory = await getEmployeeDirectory() // response is an object containing array of stub employee objects
        let profiles = await getEmployeeDetails( directory ) // response is an object containing an array of employee objects
        profiles.forEach( ( profile ) => {
            employee = directory.employees.find( ( element ) => element.finchId === profile.finchId )
            profile.department = employee.department
            profilesList.push( profile )
        })
        return profilesList
    } catch ( error ) {
        return error
    }
}
/**
 * @name getEmployeeDirectory()
 * @description This function calls the /employee/directory endpoint leveraging the sendHttpRequest helper
 * @returns object 
 */
export async function getEmployeeDirectory() {
    let httpRequestInputs = {
        method: 'get',
        resource: 'employer/directory'
    }
    try {
        let employeeListRaw = await sendHttpRequest(httpRequestInputs) // raw data from Finch
        let employeeListClean = await cleanEmployeeDirectory(employeeListRaw.individuals)
        return employeeListClean
    } catch ( error ) {
        return error
    }
}
/**
 * 
 * @param {object} directory 
 * @returns object containing an array of stub employee records
 */
async function cleanEmployeeDirectory( employees ) {
    let cleaned = {}
    let employeeList = []
    try {
        employees.forEach(( employee ) => {
            if ( employee.is_active === true ) {
                cleaned = {
                    finchId: employee.id,
                    firstName: employee.first_name,
                    middleName: employee.middle_name,
                    lastName: employee.last_name,
                    department: employee.department.name
                }
                employeeList.push( employee )
            }
        })
        cleaned.employees = employeeList
        return cleaned
    } catch ( error ) {
        return error
    }
}
/**
 * 
 * @param { object } directory 
 * @returns { object }
 */
export async function getEmployeeDetails( directory ) {

    let employees = {}
    let profileList = []

    try {
        let employeeList = directory.employees
        let formatedEmployeeList = []  // need to format the list to conform to the request body requirements
        let requestBody = {}
        await employeeList.forEach( ( employee ) => { 
            formatedEmployeeList.push( { individual_id: employee.id } )
        })
        console.log(formatedEmployeeList)
        requestBody.requests = formatedEmployeeList
        let httpRequestInputs = {
            method: 'post',
            resource: 'employer/individual',
            body: requestBody
        }
        let response = await sendHttpRequest( httpRequestInputs ) // raw data from Finch
        await response.responses.forEach(( property ) => {
            let profile = {
                    finchId: property.body.id,
                    firstName: property.body.first_name,
                    middleName: property.body.middle_name,
                    lastName: property.body.last_name,
                    emailAddress: property.body.emails[0].data,
                    phoneNumber: property.body.phone_numbers[0].data,
                    gender: property.body.gender,
                    dateOfBirth: property.body.dob,
                    addressOne: property.body.residence.line1,
                    addressTwo: property.body.residence.line2,
                    city: property.body.residence.city,
                    state: property.body.residence.state,
                    country: property.body.residence.country,
                    postalCode: property.body.residence.postal_code
                }
            profileList.push( profile )
        })
        employees.profiles = profileList // save the completed list to the 'profiles' key of the { employees } return object
        return employees  // returns an object containing an array of employee profiles
    } catch ( error ) {
        return error
    }
}
/**
 * Internal API methods 
 */
/**
 * @name addEmployees
 * @param {*} employees 
 * @returns object containing the ids of the inserted records
 */
export async function addEmployees( employees ) {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING
    
    try {
        let validation = await validateEmployees( employees )
        if ( validation.status === 'error' ) {
            error = {
                name: 'Employee validation error',
                message: 'There was an error adding employees',
                stack: validation.errors
            }
        }
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

    if ( status != process.env.API_STATUS_ERROR ) {
        try {
            results = await insert( employees )
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
    functionInvoked = 'employeesController.addEmployees()'
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

/**
 * @name editEmployees
 * @param { object } employees An object containing an array of employee objects to write to MongoDb
 * @return { object } 
 */
export async function editEmployees( employees ) {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    let filter = {}
    let resultsList = []
    let result = {}
    
    try {
        let validation = validateUsers( employees )
        if ( validation.status === 'error' ) {
            error = {
                name: 'Employee validation error',
                message: 'Employee validation failed.  See body for details.',
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

    try {
        employees.requests.forEach( async ( employee ) => {
            filter = { __id : employee.__id }
            result = await update( filter, employee )
            resultsList.push( result )
            console.log(resultsList)
        })
        body = { results: resultsList }
        console.log(body)
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

    functionInvoked = 'employeesController.editEmployees()'
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

/**
 * @name findEmployees
 * @param { object } criteria 
 * @returns 
 */
export async function findEmployees( criteria ) {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    try {
        let results = await find( criteria )
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

    functionInvoked = 'employeesController.findEmployees()'
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
/**
 * @name deleteEmployees
 * @param { object } employees 
 * @returns 
 */
export function deleteEmployees( employees ) {
    let deletedEmployees = {}
    return deleteEmployees
}

async function validateEmployees( employees ){
    try {
        let response = {
            status: ''
        }
        // Confirm the input parameter is an array with at least one element
        if ( ! Array.isArray( employees )) {
            return {
                status: 'error',
                message: 'The function must be passed an array of employee objects.'
            }
        }
        if ( employees.length < 1 ) {
            return {
                status: 'error',
                message: 'The input array must have at least one element.'
            }
        }
        // Validate each employee in the array
        let errors = []
        employees.forEach( ( employee ) => {
            if ( ! employee.hasOwnProperty( 'finchId' )) {
                errors.push('The request must provide a Finch Id property')
            }
            if ( ! employee.hasOwnProperty( 'firstName' ) ) {
                errors.push('The request must provide a first name property.')
            } else {
                if ( employee.firstName.length < 2 ) {
                    errors.push('The company name property must have at least 3 characters')
                }
                if ( employee.firstName.length > 20 ) {
                    errors.push('The company name property must have fewer than 75 characters')
                }
            }
            if ( ! employee.hasOwnProperty(' lastName ')) {
                errors.push('The request must provide a last name property')
            }
            if ( errors.length > 0 ) {  // return after the first employee that fails validation
                response =  {
                    status: 'error',
                    errors: errors,
                    offender: employee
                }
            } 
        })
        return response
    } catch ( error ) {
        return error
    }
}