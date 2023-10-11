/**
 *   MongoDb function wrappers
 */
import { connectToMongoDb } from '../mongodb/database.js'
/**
 * @name insert
 * @description A batch insert function wrapping MongoDb's insertMany() function
 * @param { object } objects An object with a <requests> parameter containing an array of objects to insert
 * @returns  { object } A canonical response object with an array of inserted ids in the Response <body>
 */
export async function insert( request ) { 
    let data
    let status = 'processing'
    let recordCount = 0
    try {
        const connection = await connectToDatabase( request.collection )
        const results = await connection.insertMany( request.requests ) 
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
export async function update( request ) {
    let body = {}
    let status = 'processing'
    try {
        const connection = await connectToDatabase( request.collection )
        const results = await connection.replaceOne( request.filter, request.object )
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
export async function find( request ) {
    var data
    var status = 'processing'
    var recordCount = 0
    try {
        console.log(request)
        const connection = await connectToDatabase( request.collection )
        const results = connection.find( request.criteria, request.options )
        data = await results.toArray() // MongoDb returns a Cursor object so we need to use toArray() here
        recordCount = data.length
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
    var response = {
            status: status,
            recordCount: recordCount,
            data: data
        }
    return response
}

async function connectToDatabase( collection ) {
    let database
    let client
    try {
        client = await connectToMongoDb()
        database = client.db('bluebird')
        collection = database.collection( collection )
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