/**
 *   Statements Model
 */

import { connectToMongoDb } from '../utilities/mongodb/database.js'

export async function insert(statements) {
    let collection = await connectToDatabase()
    let inserted = await collection.insertMany(statements)
    return inserted
}

export async function update(statements) {
    let reports = connectToDatabase()
    let updated = await reports.update(statements)
    return updated
}

export async function get(criteria) {
    let reports = connectToDatabase()
    let retrieved = await reports.get(criteria)
    return retrieved
}

async function connectToDatabase() {
    let client = await connectToMongoDb()
    let database = client.db('bluebird')
    let collection = database.collection('statements')
    return collection
}