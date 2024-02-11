const lambdaHandlers = {
  sample_handler: "sample-service-sample-handler"
  sampleHandler2: "sample-service-sampleHandler2"
  sample_event_handler: "sample-service-sample_event_handler"
  api_sample: "sample-service-api-sample"
  
}
type LambdaHandler = keyof typeof lambdaHandlers