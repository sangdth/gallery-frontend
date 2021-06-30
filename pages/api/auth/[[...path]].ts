import { NextApiRequest, NextApiResponse } from 'next';
import { superTokensNextWrapper } from 'supertokens-node/nextjs';
import Supertokens from 'supertokens-node';
// import NextCors from 'nextjs-cors';
import { backendConfig } from '../../../config/supertokensConfig';

Supertokens.init(backendConfig());

export default async function superTokens(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // NOTE: We need CORS only if we are querying the APIs from a different origin
  // await NextCors(req, res, {
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   origin: 'TODO',
  //   credentials: true,
  //   allowedHeaders: ['content-type', ...Supertokens.getAllCORSHeaders()],
  // });

  await superTokensNextWrapper(
    async (next) => {
      await Supertokens.middleware()(req, res, next);
    },
    req,
    res,
  );
  if (!res.writableEnded) {
    res.status(404).send('Not found');
  }
}
