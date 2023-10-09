/**
 *   Employer Model
 */
import { connectToMongoDb } from '../utilities/mongodb/database.js'

/**
 * 
 * @param { array } employers 
 * @returns { object } 
 */
export async function insert( employers ) {
    try {
        let collection = await connectToDatabase()
        let inserted = await collection.insertMany( employers )
        return inserted
    } catch ( error ) {
        return error
    }
}
/**
 * 
 * @param { array } employers 
 * @returns { object }
 */
export async function update( employers ) {
    try {
        let collection = await connectToDatabase()
        if ( ! await validateEmployers( employers ) ) {
            return {
                status: 'error',
                message: 'Could not validate employer list input'
            }
        }
        let updated = await collection.update( employers )
        if ( updated ) {
            return updated
        } else {
            return {
                status: 'error',
                message: 'There was a problem updating the records'
            }
        }
    } catch ( error ) {
        return error
    }
}

export async function get(criteria) {
    let employers = connectToDatabase()
    let retrieved = await employers.get(criteria)
    return retrieved
}

async function connectToDatabase() {
    let client = await connectToMongoDb()
    let database = client.db('bluebird')
    let collection = database.collection('employers')
    return collection
}