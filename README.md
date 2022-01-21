# gallery-frontend
I never find a good service for a simple portfolio/gallery site so I create one for myself and friends.

## Development environment

- Clone the repo
```
git clone git@github.com:sangdth/gallery-backend.git
cd gallery-frontend
```
```
# Then
npm install 
# or
yarn
```
- Create `.env` file with following:
```
NEXT_PUBLIC_BACKEND_ENDPOINT=http://localhost:1337
```

- Follow the instructions here to get backend up and running: https://github.com/sangdth/gallery-backend

- Run the development server:

```bash
npm run dev
# or
yarn dev
```

- Now open [http://localhost:3000](http://localhost:3000) and start coding!

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Demo

Update later :D

## About nhost

This repo is the frontend only, the backend relies on [nhost](https://github.com/sangdth/gallery-backend) service.
They provide super nice system, includes GraphQL (Hasura), Auth, Storage out of the box.
Simply register and copy their environment information.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [nhost](https://supertokens.io/docs/emailpassword/nextjs/about) - easy authentication with SuperTokens
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
