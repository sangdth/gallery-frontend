import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { auth } from '../lib/nhost';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await auth.login({ email, password });
    } catch (error) {
      console.log(error); // eslint-disable-line
      return alert('login failed'); // eslint-disable-line
    }

    return router.push('/');
  }

  return (
    <div>
      <div>Login</div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
      <div>
        <Link href="/signup">
          Sign up
        </Link>
      </div>
    </div>
  );
}
