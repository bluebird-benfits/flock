/**
 * Import Controller
 * @description Orchestrates the data import process from the underlying payroll system 
 */
import { buildEmployeeProfiles, addEmployees } from '../controllers/employeesController.js'
import { payStatementBulkImport } from '../controllers/statementsController.js'
import { insert } from '../models/userModel.js'

/**
 * Function: executeInitialImportProcess()
 * @description This function serves as the primary flow controller for the initial data import process
 * @param { object } employer An employer object of the company for which to import data
 * @returns boolean
 */
export async function executeInitialImportProcess( employer ) {
    console.log( 'Begin - executeInitialImportProcess' )
    let completeEmployeeProfiles = []
    try {
        let employeeProfiles = await buildEmployeeProfiles( employer ) // returns an array of employee records
        if ( employeeProfiles === undefined ) {
            return {
                statusCode: 400,
                status: 'error',
                message: 'There was a problem retrieving the employee records.'
            }
        }
        let payStatements = await payStatementBulkImport( employer )  // returns an array of pay statments
        if ( payStatements === undefined ) {
            return {
                statusCode: 400,
                status: 'error',
                message: 'There was a problem retrieving the pay statements'
            }
        }
        employeeProfiles.forEach( ( profile ) => {
            let statement = payStatements.find( ( record ) => record.id === profile.finchId )
            profile.statement = statement
            completeEmployeeProfiles.push( profile )
        })
        let insertedEmployeeProfiles = addEmployees( completeEmployeeProfiles )
        if ( insertedEmployeeProfiles === undefined ) {
            return {
                statusCode: 400,
                status: 'error',
                message: 'There was an error inserting the employees'
            }
        }
        console.log( 'End - executeInitialImportProcess' )
        return insertedEmployeeProfiles
    } catch ( error ) {
        return error
    }
}