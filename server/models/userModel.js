
import { connectToMongoDb } from '../utilities/mongodb/database.js'
/**
 * 
 * @param { array } users
 * @returns { object }
 */

let body = {}
let status = process.env.API_STATUS_PROCESSING
let statusCode = 0
let processStart = ''
let processEnd = ''
let processDuration = 0
let functionInvoked = ''
let criteria = {}
let results

export async function insert( users ) {

    processStart = Date.now()

    try {
        let collection = await connectToDatabase()
        results = await collection.insertMany( users )
        body = results
        status = process.env.API_STATUS_SUCCESS
        statusCode = 200
    } catch ( e ) {
        status = process.env.API_STATUS_ERROR
        error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = error
        status = process.env.API_STATUS_ERROR
        statusCode = 400
    }

    functionInvoked = 'userModel.insert()'
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

export async function update( user ) {
    let users = await connectToDatabase()
    let updated = await users.update(user)
    return updated
}

export async function find( criteria ) {

    processStart = Date.now()

    try {
        let collection = await connectToDatabase()
        let results = collection.find()
        body = { users: await results.toArray() }
        status = process.env.API_STATUS_SUCCESS
    } catch ( e ) {
         error = {
            name: e.name,
            message: e.message,
            stack: e.stack
        }
        body = { error: error }
        status = process.env.API_STATUS_ERROR
    }

    functionInvoked = 'userModel.find()'
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
    let collection = database.collection('users')
    return collection
}