import React, { useState } from 'react';
import Link from 'next/link';
import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Stack,
  Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { ErrorBoundary, Logo, Input } from '@/components';
import { nhost } from '@/lib/nhost';

export default function SignUp() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      await nhost.auth.signUp({
        email,
        password,
        options: {
          displayName,
        },
      });

      return await router.push('/');
    } catch (err) {
      setError('Signup failed, please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ErrorBoundary>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="space-between"
        width="300px"
        height={error ? '400px' : '350px'}
        marginX="auto"
        marginTop="100px"
      >
        <Logo name="GALLERY" />

        <Stack spacing="10px" alignItems="center">
          <Text
            as="h2"
            color="gray"
            fontSize="2xl"
            fontWeight="bold"
          >
            Sign Up
          </Text>

          {error && (
            <Alert
              status="error"
              variant="subtle"
              fontSize="xs"
            >
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Input
            type="text"
            placeholder="Display name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            value={password}
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            isFullWidth
            isLoading={loading}
            disabled={!email || !password}
            variant="solid"
            colorScheme="green"
            onClick={handleSubmit}
          >
            Agree Terms & Sign Up
          </Button>

          <Link href="/login">
            Login
          </Link>
        </Stack>
      </Flex>
    </ErrorBoundary>
  );
}
