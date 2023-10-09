async function getDirectory(req, res, next) {
    try {
        let payload = {
            "method": "get",
            "headers": {          
                "authorization": "Bearer d668c04b-12ed-4cfe-bcd3-61099a447790",
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Connection": "keep-alive",
                "Finch-API-Version": "2020-09-17"
            }
        }
        let directory = await fetch(`https://api.tryfinch.com/employer/directory`, payload)
        let response = await directory.json()
        let employeeList = Object.values(response.individuals)
        return employeeList
    } catch (e) {
        console.log(e)
    }
}
let employeeList = await getDirectory()

async function processEmployeeList(employeeList) {

    let client = await connectToMongoDb()
    let database = client.db('bluebird')
    let collection = database.collection('employees')
    
    employeeList.forEach((employee) => {
        let firstName = employee.first_name
        let lastName = employee.last_name
        let id = employee.id
        
        let bbgiEmployee = {
            finchId: id,
            firstName: firstName,
            lastName: lastName
        }
        collection.insertOne(bbgiEmployee)
    })
}

async function getPayrollRun(startDate, endDate) {
    try {
        let uri = 'https://api.tryfinch.com/employer/payment' + '?start_date=' + startDate + '&end_date=' + endDate
        console.log(uri)
        let payload = {
            "method": "get",
            "headers": {          
                "authorization": "Bearer d668c04b-12ed-4cfe-bcd3-61099a447790",
                "Content-Type": "application/json",
                "Accept": "*/*",
                "Connection": "keep-alive",
                "Finch-API-Version": "2020-09-17"
            }
        }
        let payroll = await fetch(uri, payload)
        let response = await payroll.json()
        let payrollRunId = response[0].id
        return payrollRunId
    } catch (e) {
        console.log(e)
    }
}
let paymentId = await getPayrollRun('2020-09-01', '2020-09-30')

async function getPayStatementsByPaymentId(paymentId) {
    try {
        let uri = 'https://api.tryfinch.com/employer/pay-statement'
        let payload = {
                method: "post",
                headers: {          
                    "Authorization": "Bearer d668c04b-12ed-4cfe-bcd3-61099a447790",
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Connection": "keep-alive",
                    "Finch-API-Version": "2020-09-17"
                },
            }
        let body = {
            "requests": [
                {
                    "payment_id": "fbfee20a-4df9-427a-a694-50b1d5cc66c6"
                }
            ]
        }
        payload.body = JSON.stringify(body)
        let statements = await fetch(uri, payload)
        let response = await statements.json()
    } catch (e) {
        console.log(e)
    }
}

getPayStatementsByPaymentId("fbfee20a-4df9-427a-a694-50b1d5cc66c6")
