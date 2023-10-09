/* User Validation */

export function validateUser(expressJsUser) {
    // TO-DO: confirm fields values conform to business rules
    if (( expressJsUser.firstName == undefined ) || 
        ( expressJsUser.lastName == undefined) || 
        ( expressJsUser.dateOfBirth == undefined)) {
        let error =  {
            status: 'error',
            statusCode: 403,
            errorMessage: 'Malformed request body'
        }
        return error
    } else {
        let validatedUser = {
            firstName: expressJsUser.firstName,
            lastName: expressJsUser.lastName,
            dateOfBirth: expressJsUser.dateOfBirth
        }
        return validatedUser
    }
}