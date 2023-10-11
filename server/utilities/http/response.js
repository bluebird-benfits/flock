/**
 * Response
 */
 
import randomstring from "randomstring"

export function responseObject( parameters ) {

    let responseObject = {
        _id: randomstring.generate(7),
        module: parameters.moduleName,
        function: parameters.functionName,
        status: 'processing',
        statusCode: 0,
        processStart: Date.now(),
        processEnd: '',
        processDuration: 0,
        body: {},
        onSuccess: function( results ) {
            this.status = 'success'
            this.statusCode = 200
            this.body = results
        },
        onError: function( e ) {
            let error = {
                name: e.name,
                message: e.message,
                stack: e.stack
            }
            this.body = error
            this.status = 'error'
            this.statusCode = 400
        },
        onClose: function() {
            this.processEnd = Date.now()
            this.processDuration = ( this.processEnd - this.processStart ) / 1000
        }
    }
    return responseObject
}