const path = require('path')
const fs = require('fs')
const interpolate = require('./interpolate')
/* eslint-disable sort-keys */
const arrayResponseSchemaBase = {
  additionalProperties: false,
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            default: '__TYPE__',
            example: '__TYPE__',
          },
          attributes: {
            $ref: '__MODEL__',
          },
        },
      },
    },
  },
}

/* eslint-enable sort-keys */

const buildArrayResponseSchema = (type, model) => {
  return JSON.parse(
    JSON.stringify(arrayResponseSchemaBase)
      .replace(/__TYPE__/g, type)
      .replace(/__MODEL__/g, model)
  )
}

module.exports = function createPaths(
  { wrapExamples = true, referenceRoot = '#/definitions/' } = {}
) {
  const pathsPath = path.join(__dirname, '../', '../', 'specification', 'paths')
  const files = fs.readdirSync(pathsPath)
  const result = files.reduce((paths, fileName) => {
    const fullPath = path.join(pathsPath, fileName)

    const name = fileName
      .replace('.json', '')
      .split(':')
      .join('/')

    const isDirectory = fs.lstatSync(fullPath).isDirectory()
    let pathObject

    if (!isDirectory) {
      pathObject = require(fullPath)
    } else {
      const verbs = fs.readdirSync(fullPath)
      pathObject = verbs.reduce((obj, verb) => {
        if (verb[0] === '.') {
          return obj
        }
        const verbPath = path.join(fullPath, verb)
        const verbDescriptionPath = path.join(verbPath, 'description.md')
        const verbExamplePath = path.join(verbPath, 'example.json')

        const verbObject = require(verbPath)
        if (fs.existsSync(verbDescriptionPath)) {
          verbObject.description = fs.readFileSync(verbDescriptionPath, 'utf8')
        }

        if (verbObject.parameters) {
          verbObject.parameters = verbObject.parameters.map(parameter => {
            delete parameter.example
            return parameter
          })
        }

        if (fs.existsSync(verbExamplePath)) {
          const example = require(verbExamplePath)
          if (wrapExamples) {
            verbObject.responses['200'].examples = {
              'application/json': example,
            }
          } else {
            verbObject.responses['200'].example = example
          }
        }

        if (verbObject.responses['200'].$schema) {
          if (verbObject.responses['200'].$schema.$type === 'arrayResponse') {
            const model = verbObject.responses['200'].$schema.$model
            const modelType = verbObject.responses['200'].$schema.$modelType
            verbObject.responses['200'].schema = buildArrayResponseSchema(
              modelType,
              model
            )
          }
          delete verbObject.responses['200'].$schema
        }

        obj[verb] = verbObject
        return obj
      }, {})
    }

    paths[`/${name}`] = pathObject
    return paths
  }, {})
  return interpolate(result, '__ROOT__', referenceRoot)
}
