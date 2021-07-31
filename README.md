# gallery
I never find a good service for a simple portfolio/gallery site so I create one for myself and friends.

### Register for services

#### nhost
This repo is the frontend only, all of backend relies on [nhost](https://nhost.io) service.
They provide super nice system, includes GraphQL (Hasura), Auth, Storage out of the box.
Simply register and copy their environment information.

### Development environment

First, create `.env` file with following:
```
# Public Environment variables that can be used in the browser.
NEXT_PUBLIC_APP_URL="http://localhost:3000"

NEXT_PUBLIC_GRAPHQL_ENDPOINT=https://hasura-{your-id}.nhost.app/v1/graphql
NEXT_PUBLIC_BACKEND_ENDPOINT=https://backend-{your-id}.nhost.app
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

- [nhost](https://supertokens.io/docs/emailpassword/nextjs/about) - easy authentication with SuperTokens
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
