/**
 * Logger Controller
 */
export function logEvent( logEvent ) {
    let event = Date.now() + ` - ` + JSON.stringify(logEvent)
    console.log( event )
}