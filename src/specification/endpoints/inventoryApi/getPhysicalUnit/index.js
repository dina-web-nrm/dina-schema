const createResponse = require('../../../../factories/utilities/createEndpointResponse')

const path = '/api/v01/physicalUnits/{id}'
const selfLink = path

module.exports = {
  method: 'get',
  path,
  pathParams: {
    id: {
      description: 'physicalUnits id',
      example: '1',
      required: true,
      schema: {
        type: 'string',
      },
    },
  },
  response: createResponse({
    format: 'object',
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
  summary: 'Get a physicalUnits by id',
}
