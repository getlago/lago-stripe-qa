## Start the API

```bash
cd api

touch .env # You should update this file

docker-compose build qa_api
docker-compose up qa_api
```

API url will be http://0.0.0.0:4567

## .env
STRIPE_SECRET_KEY=CHANGE_ME
LAGO_API_KEY=CHANGE_ME
LAGO_API_URL=CHANGE_ME
REDIS_URL=redis://redis:6379

## API end points

- get / : Health check
- post /customer
  - JSON payload should contain customer_id, email, name
  - response will be a json with customer_id, lago_id, stripe_customer_id (blanck at this step)
- get /customer/:id
  - id = customer_id
  - response will be a json with customer_id, lago_id, stripe_customer_id
  - should be called until stripe_customer_id is present
- get /secret/:id
  - id = customer_id
  - retrieve stripe intent secret
  - response will be a json with client_secret. Use this value to retrieve the stripe setup intent
