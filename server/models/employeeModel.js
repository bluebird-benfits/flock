/**
 *   Employee Model
 */
import { connectToMongoDb } from '../utilities/mongodb/database.js'

let body = {}
let error
let status = ''
let statusCode = 0
let processStart = ''
let processEnd = ''
let processDuration = 0
let functionInvoked = ''
let criteria = {}
let results

export async function insert( employees ) { // accepts an object with a single requests property containing an array of employee objects

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING
    try {
        let collection = await connectToDatabase()
        results = await collection.insertMany( employees.requests ) 
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

    functionInvoked = 'employeeModel.insert()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
            functionInvoked: functionInvoked,
            status: status,
            processStart: processStart,
            processEnd: processEnd,
            processDuration: processDuration,
            body: body
        }
    return response
}

export async function update( filter, employee ) {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    try {
        let collection = await connectToDatabase()
        results = await collection.replaceOne( filter, employee )
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
    // finish constructing the response object
    functionInvoked = 'employeeModel.update()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
            functionInvoked: functionInvoked,
            status: status,
            processStart: processStart,
            processEnd: processEnd,
            processDuration: processDuration,
            body: body
        }
    return response
}

export async function find( criteria ) {

    processStart = Date.now()
    status = process.env.API_STATUS_PROCESSING

    try {
        let collection = await connectToDatabase()
        results = collection.find( criteria )
        body = await results.toArray()
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
    functionInvoked = 'employeeModel.find()'
    processEnd = Date.now()
    processDuration = ( processEnd - processStart ) / 1000

    let response = {
            functionInvoked: functionInvoked,
            status: status,
            processStart: processStart,
            processEnd: processEnd,
            processDuration: processDuration,
            body: body
        }
    return response
}

async function connectToDatabase() {
    let client = await connectToMongoDb()
    let database = client.db('bluebird')
    let collection = database.collection('employees')
    return collection
}