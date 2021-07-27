import { useState } from 'react';
import { auth } from '../../lib/nhost';

export const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

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
    <div>
      <h2>Change password</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              placeholder="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">Change password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
