// Module: providers
import express from 'express'

const router = express.Router()

router.get(`/`, (req, res) => {
    res.send(`getting a list of providers`)
})
router.get(`/:id`, (req, res) => {
    res.send(`getting a provider with the id ` + req.params.id)
})
router.get(`/:id/connections`, (req, res) => {
    res.send(`getting a list of connections active for provider with id ` + req.params.id)
})
router.get(`/:id/deductions`, (req, res) => {
    res.send(`getting a list of deductions configured for this provider`)
})
router.post(`/`, (req, res) => {
    res.send(`creating a new provider`)
})

export default router