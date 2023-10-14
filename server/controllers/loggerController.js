/**
 * Logger Controller
 */
import { EventEmitter } from 'events'

export function logEvent() {
    const emitter = new EventEmitter()
    emitter.on( 'event', () => {
        console.log('event happened')
    })
}