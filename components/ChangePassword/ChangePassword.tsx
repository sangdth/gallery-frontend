import { useState } from 'react';
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Stack,
} from '@chakra-ui/react';
import { PasswordInput } from '../PasswordInput';
import { auth } from '../../lib/nhost';

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await auth.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.log(error); // eslint-disable-line
      // return alert('update failed'); // eslint-disable-line
    }

    setCurrentPassword('');
    setNewPassword('');
  }

  return (
    <Flex>
      <Flex direction="column">
        <Flex direction="column">
          <FormControl>
            <FormLabel>Change Password</FormLabel>
            <Stack spacing={3}>
              <PasswordInput
                id="current-password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <PasswordInput
                id="new-password"
                placeholder="Enter new password"
                isInvalid={newPassword !== confirmNewPassword}
                errorBorderColor="red.300"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <PasswordInput
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
        <Flex>
          <Button onClick={handleSubmit}>
            Change Password
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ChangePassword;
