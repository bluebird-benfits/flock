/**
 * Reports Controller
 * 
 */
import { insert, update, find } from '../utilities/mongodb/wrapper.js'

/**
 * 
 * @param { obejct } reports 
 * @returns { object }
 */
export async function addReports( request ) {

}

/**
 * 
 * @param { obejct } reports 
 * @returns { object }
 */
export async function findReports( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        data = error
        status = 'error'
    }
    data = [ { name: 'Test Corporation' } ]

    const response = {
        status: 'success',
        recordCount: 1,
        data: data
    }
    return response
}

/**
 * 
 * @param { obejct } reports 
 * @returns { object }
 */
export async function editReports( request ) {

}