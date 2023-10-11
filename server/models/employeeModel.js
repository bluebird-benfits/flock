/**
 *   Employee Model
 */
import { connectToMongoDb } from '../utilities/mongodb/database.js'

/**
 * @name insert
 * @description A batch insert function wrapping MongoDb's insertMany() function
 * @param { object } employees An object with a <requests> parameter containing an array of employee objects
 * @returns  { object } A canonical response object with an array of inserted ids in the Response <body>
 */
export async function insert( employees ) { 
    let data
    let status = 'processing'
    let recordCount = 0
    try {
        let connection = await connectToDatabase()
        const results = await connection.insertMany( employees.requests ) 
        data = Object.values( results.insertedIds )
        recordCount = results.insertedCount
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
    const response = {
        status: status,
        recordCount: recordCount,
        data: data
    }
    return response
}

/**
 * @name update
 * @description 
 * @param { array } filter 
 * @param { object } employee 
 * @returns 
 */
export async function update( filter, employee ) {
    let body = {}
    let status = 'processing'
    try {
        const connection = await connectToDatabase()
        const results = await connection.replaceOne( filter, employee )
        body = results
        status = 'success'
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = error
        status = 'error'
    }
    const response = {
        status: status,
        body: body
    }
    return response
}

/**
 * @name find
 * @description 
 * @param { object } criteria An object containing an array of key-value pairs describing the filters
 * @returns { object } A canonical response object 
 */
export async function find( criteria ) {
    let data
    let status = 'processing'
    let options = {
        limit: 18
    }
    try {
        let connection = await connectToDatabase()
        const results = connection.find( criteria, options )
        data = await results.toArray() // MongoDb returns a Cursor object so we need to use toArray() here
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
    let response = {
            status: status,
            data: data
        }
    return response
}

async function connectToDatabase() {
    let collection
    let database
    let client
    try {
        client = await connectToMongoDb()
        database = client.db('bluebird')
        collection = database.collection('employees')
    } catch ( e ) {
        const error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        return error
    }
    return collection
}