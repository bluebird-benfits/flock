/**
 * Module: Employees Controller
 * @description This module is the controller handling all requests related to employee records
 */
// import { insert, update, find } from '../models/employeeModel.js'
import { sendHttpRequest } from '../utilities/http/http.js'
import { insert, update, find } from '../utilities/mongodb/wrapper.js'
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
 * @description Controller function that orchestrates bulk inserting of new employee records to MongoDb
 * @param { object } employees An object containing an array of employee objects to update in MongoDb
 * @returns { object } A canonical response object with an array of inserted ids in the Response <body>
 */
export async function addEmployees( request ) {
    let data
    let status = 'processing'
    let recordCount = 0
    try {
        // validate the employee records passed via the employees parameter
        let validation = await validateEmployees( request.requests )
        if ( validation.status === 'error' ) {
            const error = {
                name: 'Employee validation error',
                message: 'Employee validation failed.',
                stack: validation.body
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
                collection: 'employees',
                requests: request.requests
            }
            const results = await insert( params )
            if ( results.status === 'error' ) {
                status = 'error'
                httpResponseCode = 400
            } else {
                status = 'success'
            }
            data = results.data
            recordCount = results.recordCount
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
    const response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    return response
} 

/**
 * @name editEmployees
 * @description Controller function that orchestrates bulk editing of employee records to MongoDb
 * @param { object } employees An object containing an array of employee objects to write to MongoDb
 * @return { object } A canonical response object with an array of edited ids in the Response <body>
 */
export async function editEmployees( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    var updated = []
    var fallout = []
    try {
        const validation = await validateEmployees( request.requests )
        if ( validation.status === 'error' ) {
            const error = {
                name: 'Employee validation error',
                message: 'Employee validation failed.',
                stack: validation.data
            }
            data = error
            status = 'error'
        } else {
            request.requests.forEach( async ( object ) => {
                let filter = { _id : object._id }
                let params = {
                    collection: 'employees',
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

/**
 * @name findEmployees
 * @param { object } criteria 
 * @returns 
 */
export async function findEmployees( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        const params = {
            collection: 'employees',
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

/**
 * @name validateEmployees
 * @description
 * @param { array } employees An array of employee objects
 * @returns 
 */
async function validateEmployees( employees ) {
    let data
    let error
    let errors = []
    let status = 'processing'
    try {
        if ( ! Array.isArray( employees )) {
            return error = {
                name: 'Employee validation error',
                message: 'The function must be passed an array of employee objects.'
            }
        }
        if ( employees.length < 1 ) {
            return error = {
                name: 'Employee validation error',
                message: 'The input array must have at least one element.'
            }
        }
        employees.forEach( ( employee ) => {
            if ( ! employee.hasOwnProperty( 'finchId' )) {
                errors.push('The request must provide a Finch Id property')
            }
            if ( ! employee.hasOwnProperty( 'firstName' ) ) {
                errors.push('The request must provide a first name property.')
            } else {
                if ( employee.firstName.length < 2 ) {
                    errors.push('The First Name property must have at least 2 characters')
                }
                if ( employee.firstName.length > 35 ) {
                    errors.push('The First Name property must have fewer than 35 characters')
                }
            }
            if ( ! employee.hasOwnProperty( 'lastName' )) {
                errors.push( 'The request must contain a Last Name property' )
            } else {
                if ( employee.lastName.length < 2 ) {
                    errors.push( 'The Last Name must have 2 or more characters ')
                }
                if ( employee.lastName.length > 35 ) {
                    errors.push( 'The Last Name must have fewer than 35 characters.' )
                }
            }
            if ( ! employee.hasOwnProperty( 'employerId') ) {
                errors.push( 'The request must contain an EmployerId property' )
            }
            if ( ! employee.hasOwnProperty( 'email') ) {
                errors.push( 'The request must contain an Email property' )
            }

            if ( errors.length > 0 ) {  // return after the first employee that fails validation
                error =  {
                    name: 'Employee validation error',
                    errors: errors,
                    offender: employee
                }
                return response = {
                    status: 'error',
                    data: error
                }
            }
        }) // end foreach
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
        data: data
    }
    return response
}