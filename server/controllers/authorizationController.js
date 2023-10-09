/**
 *   Authorization Controller
 */

export async function getToken() {
    let httpRequestInputs = {
        method: 'get',
        resource: 'authorize',
        query: {}
    }
}

export async function storeTokenSecurely() {
    // hash the token and save it
    // MySql with backup
}