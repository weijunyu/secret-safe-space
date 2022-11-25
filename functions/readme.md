# Document TTL

Document expiry will be handled via 2 processes:

1. Documents whose `expiresAt` field is lesser than the current time would not be read.

2. A scheduled function would run periodically and remove all documents whose `expiresAt` field is lower than the current time.

# Environment variables

In local dev, create `.env` in this folder. Set CORS_ORIGIN to the client URL, eg `CORS_ORIGINS=["http://localhost:3000"]`
