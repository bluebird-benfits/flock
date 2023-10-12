/**
 * Statements Controller
 * 
 */
import { sendHttpRequest } from "../utilities/http/http.js";

export async function payStatementBulkImport() {
    console.log('Begin - buildPaystatments')
    let lastPaymentRunId = await getLastPaymentRun()
    let payStatements = await getPayStatements( lastPaymentRunId )
    console.log('End - buildPayStatements')
    return payStatements
}
       
export async function addPayStatements() {

}

export async function editPayStatements() {

}

export async function getPayStatements(paymentId) {
    console.log('Begin - getPayStatements')
    let httpRequestInputs = {
        method: 'post',
        resource: 'employer/pay-statement',
        body: {
            requests: [{
                payment_id: paymentId
            }]
        }
    }
    try {
        let response = await sendHttpRequest(httpRequestInputs)
        let statements = response.responses[0].body
        let statementsList = []
        await statements.pay_statements.forEach((statement) => {
            let federalTaxes = 0
            let stateTaxes = 0
            let ficaTaxes = 0
            let pretaxDeductions = 0
            let cleanStatement = {
                id: statement.individual_id,
                type: statement.type,
                grossPay: statement.gross_pay.amount,
                currency: statement.gross_pay.currency
            }
            statement.taxes.forEach((tax) => {
                if (tax.type === 'federal') {
                    federalTaxes += Number(tax.amount)
                }
                if (tax.type === 'state') {
                    stateTaxes  += Number(tax.amount)
                }
                if (tax.type === 'fica') {
                    ficaTaxes += Number(tax.amount)
                }
            })
            cleanStatement.federalTaxes = federalTaxes
            cleanStatement.stateTaxes = stateTaxes
            cleanStatement.ficaTaxes = ficaTaxes

            statement.employee_deductions.forEach((deduction) => {
                if (deduction.pre_tax === true) {
                    pretaxDeductions += deduction.amount
                }
            })
            cleanStatement.pretaxDeductions = pretaxDeductions
            statementsList.push(cleanStatement)
        })
        console.log('End - getPayStatements')
        return statementsList
    } catch ( error ) {
        return error
    }
}

export async function savePayStatements(statements) {
    console.log('Begin - savePayStatements')
    try {
        let newStatements = await insert(statements.pay_statements)
        console.log('End - savePayStatements')
        return newStatements
    } catch ( error ) {
        return error
    }
}

export async function deletePayStatements() {

}

/**
 * Function: getLastPaymentRun()
 * @description This function retrieves the most recent payment run from the payroll system
 * @param { Date } startDate The start of the period to search 2023-01-01 
 * @param { Date } endDate The end of the period to search 2023-01-01 
 * @returns id
 */
async function getLastPaymentRun(startDate, endDate) {
    console.log('Begin - getLastPaymentRun')
    let httpRequestInputs = {
        method: 'get',
        resource: 'employer/payment',
        query: {
            start_date: '2022-12-01',
            end_date: '2022-12-15'
        }
    }
    try {
        let response = await sendHttpRequest(httpRequestInputs)
        console.log(response[0])
        console.log('End - getLastPaymentRun')
        return response[0].id  // Finch's api is a bulk request so it returns an array
    } catch ( error ) {
        return error
    }
}