/**
 *  @description Handles outgoing Http requests to external systems
 *  @param {*} parameters 
 */

export async function sendHttpRequest( parameters ) {
    console.log('Begin - sendHttpRequest')
    const accessToken = process.env.FINCH_API_ACCESS_TOKEN
    const baseUrl = process.env.FINCH_API_BASE_URL
    let options = {}
    let body = {}
    let method = ''
    let resource = {}
    let queryString = ''
    let queryParameters = {}
    let queryParametersList = []
    let headers = {
        'Finch-Api-Version': '2020-09-17',
        'Authorization': 'Bearer ' + accessToken,
        'Content-Type': 'application/json'
    }
    console.log(parameters.body)
    if (parameters.hasOwnProperty('method')) {
        method = parameters.method
    }
    if (method === undefined) {
        return {
            status: "error",
            message: "no method was provided in the request"
        }
    }
    if ( parameters.hasOwnProperty( 'resource' ) ) {
        resource = parameters.resource
    }
    if ( resource === undefined ) {
        return {
            status: "error",
            message: "no resource was provided in the request"
        }
    }
    if (parameters.hasOwnProperty('query')) {
        queryParameters = parameters.query
    }
    if (parameters.hasOwnProperty('body')) {
        body = parameters.body
    }
    try {
        let requestUri = baseUrl + resource
        if (method === 'get') {
            if (parameters.query != undefined) {
                for (let property in queryParameters) {
                    queryParametersList.push(property + '=' + queryParameters[property])
                }
                queryParametersList.forEach((value, index) => {
                    if (index === 0) {
                        queryString += '?' + value
                    } else {
                        queryString += '&' + value
                    }
                })
                requestUri += queryString
            }
        }
        options.method = method
        options.headers = headers
        if ( Object.keys( body ).length > 0 ) {
            options.body = JSON.stringify(body)
        }
        let response = await fetch(requestUri, options)
        console.log('End - sendHttpRequest')
        console.log(await response.json())
        return response
    } catch ( error ) {
        return error
    }
} 