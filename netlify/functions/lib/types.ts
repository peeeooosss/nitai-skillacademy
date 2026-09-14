export interface NetlifyFunctionEvent {
  httpMethod: string
  headers: Record<string, string | undefined>
  queryStringParameters: Record<string, string | undefined>
  body: string | null
  path: string
}

export interface NetlifyFunctionContext {
  callbackWaitsForEmptyEventLoop: boolean
  functionName: string
  functionVersion: string
  invokedFunctionArn: string
  memoryLimitInMB: number
  requestID: string
  logGroupName: string
  logStreamName: string
  identity?: unknown
}

export interface NetlifyFunctionResponse {
  statusCode: number
  headers: Record<string, string>
  body: string
}

export type NetlifyHandler = (
  event: NetlifyFunctionEvent,
  context: NetlifyFunctionContext
) => Promise<NetlifyFunctionResponse>