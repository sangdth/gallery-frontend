This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Register for services

#### SuperTokens

- We use SuperTokens for authentication. It has free version supports up to 5000 users! Register it here.
- Note down your URI and the API key.

#### Hasura and PostgresQL

- We use Hasura and PostgresQL as database to store our information like posts, descriptions etc. Regiter it here.
- After that, connect to a database. You can choose your existing or create new one from Heroku.

### Development environment

First, create `.env` file with following:
```
# Public Environment variables that can be used in the browser.
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Secret environment variables only available to Node.js
APP_URL="http://localhost:3000"

SUPERTOKENS_URI="your-supertokens-uri"
SUPERTOKENS_API_KEY="your-supertokens-api-key"
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.tsx`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [SuperTokens](https://supertokens.io/docs/emailpassword/nextjs/about) - easy authentication with SuperTokens
- [Next.js + SuperTokens](https://github.com/supertokens/next.js/blob/canary/examples/with-supertokens/pages/index.js) - Example Next.js + SuperTokens
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
