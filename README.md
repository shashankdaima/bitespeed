# Bitespeed Backend Application - Customer Identification Service

This repository contains the implementation for Bitespeed's customer identification service as per the provided assignment.


## Assignment Overview

Bitespeed needs a web service with an endpoint `/identify` that receives HTTP POST requests with a JSON body containing either an `email` or a `phoneNumber`. The service should return an HTTP 200 response with a JSON payload containing the consolidated contact details.

### Technical Specifications

- **Endpoint:** `/identify`
- **Method:** HTTP POST
- **Request Body:**
  ```json
  // either email or phoneNumber is required
  {
      "email": "string",
      "phoneNumber": "number"
  }
  ```
- **Response Body:**
  ```json
  {
    "contact": {
        "primaryContatctId": "number",
        "emails": "string[]",
        "phoneNumbers": "string[]",
        "secondaryContactIds": "number[]"
    }
  }
  ```
### Tech-stack
- Express.js (with Typescript and ZOD)
- Swagger UI
- Render for Deployment
- Docker for Containerization
- Prisma+Supabase for Postgres
  
### Curl-Definition
> **Note:** This service is deployed on Render.com's free tier. Hence, initial request will take about a minute to spin up the server.

```bash
curl -X 'POST' \
  'https://bitespeed-fyyp.onrender.com/identify' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "daimashashank10@gmail.com",
  "phoneNumber": "9999999999"
}'
```
Swagger UI: https://bitespeed-fyyp.onrender.com/api-docs
