/**
 *   Report Model
 */
import { connectToMongoDb } from '../utilities/mongodb/database.js'

export async function insert(report) {
    let reports = connectToDatabase()
    let inserted = await reports.insertOne(report)
    return inserted
}

export async function update(report) {
    let reports = connectToDatabase()
    let updated = await reports.update(report)
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
    let collection = database.collection('reports')
    return collection
}