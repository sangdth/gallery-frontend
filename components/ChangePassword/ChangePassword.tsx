import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  Heading,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { nhost } from '@/lib/nhost';
import { Input } from '@/components/Input';

const ChangePassword = () => {
  const toast = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const shouldDisable = !newPassword || newPassword !== confirmNewPassword;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await nhost.auth.changePassword({ newPassword });

      toast({
        title: 'Updated password successfully',
        position: 'top',
        status: 'success',
        isClosable: true,
        duration: 1000,
      });
    } catch (error) {
      throw new Error('Change password failed');
    }

    setNewPassword('');
  }

  return (
    <Flex>
      <Flex direction="column">
        <Flex direction="column">
          <FormControl>
            <Heading as="h4" size="md">
              Change Password
            </Heading>
            <Stack spacing={3}>
              <Input
                type="password"
                id="new-password"
                placeholder="Enter new password"
                isInvalid={newPassword !== confirmNewPassword}
                errorBorderColor="red.300"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                type="password"
                id="confirm-new-password"
                placeholder="Confirm new password"
                isInvalid={newPassword !== confirmNewPassword}
                errorBorderColor="red.300"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
            </Stack>
          </FormControl>
        </Flex>
        <Flex marginTop={5}>
          <Button disabled={shouldDisable} onClick={handleSubmit}>
            Change Password
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChangePassword;
