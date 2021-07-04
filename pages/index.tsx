import Head from 'next/head';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-auth-react/recipe/emailpassword';

// import { initializeApollo } from '../lib/apollo';

export async function getServerSideProps(context: any) {
  let session;
  try {
    session = await Session.getSession(context.req, context.res);
  } catch (err) {
    if (err.type === Session.Error.TRY_REFRESH_TOKEN) {
      return { props: { fromSupertokens: 'needs-refresh' } };
    } if (err.type === Session.Error.UNAUTHORISED) {
      return { props: {} };
    }
    throw err;
  }

  return {
    props: { userId: session?.getUserId() },
  };
}

// TODO:
// Error: You can not use getStaticProps or getStaticPaths with getServerSideProps.
// To use SSG, please remove getServerSideProps
//
// export async function getStaticProps() {
//   const apolloClient = initializeApollo();

//   // await apolloClient.query({
//   //   query: '',
//   // })

//   return {
//     props: {
//       initialApolloState: apolloClient.cache.extract(),
//     },
//   };
// }

export default function Home(props: any) {
  const { userId } = props;

  async function logoutClicked() {
    await EmailPassword.signOut();
    EmailPassword.redirectToAuth();
  }

  return (
    <div>
      <Head>
        <title>Gallery</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Next.js
        </h1>

        <button type="button" onClick={logoutClicked}>
          Logout
          {userId}
        </button>
      </main>
    </div>
  );
}
