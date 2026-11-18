# Veyroniq — AWS architecture

> Generated from `src/data/business.js` by `npm run docs`. Edit the business record, not this file.

Veyroniq is being designed as an event-driven platform on AWS. Plant gateways would stream telemetry into AWS IoT Core, readings would be stored in Amazon Timestream and Amazon S3, AWS Lambda would score new data, and models on Amazon SageMaker and Amazon Bedrock would turn it into failure forecasts and plain-language recommendations. These services make up the proposed production architecture; none is described as running in production yet.

## Five-stage pipeline

1. **Data collection** — AWS IoT Core: Plant gateways publish vibration, temperature and pressure readings over MQTT.
2. **Secure storage** — Amazon Timestream, Amazon S3: Recent readings for fast queries; full history and training sets for models.
3. **Processing** — AWS Lambda: Validates readings, routes events and triggers scoring and alert workflows.
4. **AI intelligence** — Amazon SageMaker, Amazon Bedrock: Anomaly detection, failure-window forecasts and recommendation text.
5. **Application experience** — Amazon API Gateway, Amazon DynamoDB, Amazon Cognito: Workspace API, asset and work-order records, and user sign-in.

## Services

| Service | Purpose | Status |
|---|---|---|
| AWS IoT Core | Connects plant gateways and ingests machine telemetry. | proposed |
| Amazon Timestream | Stores time-series sensor readings for trend queries and health scoring. | proposed |
| Amazon S3 | Stores raw sensor history and datasets for model training. | proposed |
| AWS Lambda | Processes incoming readings and triggers scoring and alert workflows. | proposed |
| Amazon SageMaker | Trains and hosts anomaly-detection and failure-forecasting models. | proposed |
| Amazon Bedrock | Generates maintenance recommendations and summarises asset history. | proposed |
| Amazon DynamoDB | Holds assets, health scores, alerts, work orders and recommendations. | proposed |
| Amazon API Gateway | Provides the authenticated workspace API used by the web app. | proposed |
| Amazon Cognito | Manages user sign-up, sign-in and password recovery. Client integration is written in this codebase; no user pool is configured yet. | in-progress |

Nothing above is deployed to production. Only describe a service as "running" or say "Built on AWS" once it is deployed and in use.

## Application stack

React 18, Vite, Tailwind CSS, React Router, amazon-cognito-identity-js, Vercel (website hosting)
