/**
 *   App.Js
 */
import dotenv from 'dotenv'
dotenv.config( { path: '/Users/docshufelt/Documents/bluebird/server/.env' } )

import express from 'express'
import usersRouter from './routes/usersRouter.js'
import providersRouter from './routes/providersRouter.js'
import employersRouter from './routes/employersRouter.js'
import employeesRouter from './routes/employeesRouter.js'
import reportsRouter from './routes/reportsRouter.js'
import importsRouter from './routes/importsRouter.js'
import authorizationsRouter from './routes/authorizationsRouter.js'

const PORT = 80
const app = express()

app.use( express.urlencoded({ extended: true }) )
app.use( express.json() )
app.use( '/users', usersRouter )
app.use( '/providers', providersRouter )
app.use( '/employers', employersRouter )
app.use( '/employees', employeesRouter )
app.use( '/providers', providersRouter )
app.use( '/reports', reportsRouter )
app.use( '/imports', importsRouter )
app.use( '/authorizations', authorizationsRouter )

app.listen(PORT, () => {
    console.log( 'Listening on port ' + PORT )
})