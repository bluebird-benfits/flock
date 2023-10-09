/**
 *   Authorization Router
 */
import express from 'express'

const router = express.Router()

router.post(`/`, (req, res) => {
    res.send( 'authorization' )
})

export default router