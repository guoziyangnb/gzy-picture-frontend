import { generateService } from '@umijs/openapi'

generateService({
  requestLibPath: "import request from '@/service/request'",
  schemaPath: 'http://localhost:8123/api/v2/api-docs',
  serversPath: './src/service',
})
