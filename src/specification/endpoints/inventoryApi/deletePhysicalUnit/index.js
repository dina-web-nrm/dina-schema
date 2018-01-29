const createResponse = require('../../../../factories/utilities/createEndpointResponse')

module.exports = {
  method: 'delete',
  path: '/api/v01/physicalUnits/{id}',
  pathParams: {
    id: {
      description: 'physicalUnits id',
      example: 1,
      required: true,
      schema: {
        type: 'string',
      },
    },
  },
  response: createResponse({
    format: 'object',
    operationId: 'deletePhysicalUnit',
    resource: 'physicalUnit',
  }),
  summary: 'Delete a physical unit',
}