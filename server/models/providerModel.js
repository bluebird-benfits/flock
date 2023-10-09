/**
 *   Name: Provider Model
 *   
 */
import { connectToMongoDb } from '../utilities/mongodb/database.js'

export async function insert(provider) {
    let providers = connectToDatabase()
    let inserted = await providers.insertOne(provider)
    return inserted
}

export async function update(provider) {
    let providers = connectToDatabase()
    let updated = await providers.update(provider)
    return updated
}

export async function get(criteria) {
    let providers = connectToDatabase()
    let retrieved = await providers.get(criteria)
    return retrieved
}

async function connectToDatabase() {
    let client = await connectToMongoDb()
    let database = client.db('bluebird')
    let collection = database.collection('providers')
    return collection
}
