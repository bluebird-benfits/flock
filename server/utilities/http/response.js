/**
 * Request
 */

export async function createResponseObject() {

    let body
    let error
    let processStart
    let processEnd
    let processDuration
    let functionInvoked

    return responseObject = {
        functionInvoked: functionInvoked,
        status: process.env.API_STATUS_PROCESSING,
        statusCode: 0,
        body: body,
        processStart: Date.now(),
        processEnd: '',
        processDuration: 0
        
    }
   
}