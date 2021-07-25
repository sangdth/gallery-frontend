import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { auth } from '../lib/nhost';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await auth.register({
        email,
        password,
        options: {
          userData: {
            display_name: displayName,
          },
        },
      });
    } catch (error) {
      console.log(error); // eslint-disable-line
      return alert('signup failed'); // eslint-disable-line
    }

    alert('Registration OK. Logging you in...'); // eslint-disable-line
    return router.push('/');
  }

  return (
    <div>
      <div>Register</div>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div>
            <input
              type="text"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">Register</button>
          </div>
        </form>
      </div>
      <div>
        <Link href="/login">
          Login
        </Link>
      </div>
    </div>
  );
}
