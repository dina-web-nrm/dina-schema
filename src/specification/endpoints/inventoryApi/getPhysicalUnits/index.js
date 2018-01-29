const createResponse = require('../../../../factories/utilities/createEndpointResponse')

const path = '/api/v01/physicalUnits'
const selfLink = path

module.exports = {
  method: 'get',
  path: '/api/v01/physicalUnits',
  response: createResponse({
    format: 'array',
    operationId: 'getPhysicalUnits',
    relations: [
      {
        key: 'inventoryUnit',
        selfLink: '/api/v01/inventoryUnits/{id}',
      },
    ],
    resource: 'physicalUnit',
    selfLink,
  }),
  summary: 'Get a physicalUnits',
}