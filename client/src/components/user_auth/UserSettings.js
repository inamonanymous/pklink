import React from 'react';
import Swal from 'sweetalert2';
import httpClient from '../../httpClient'; // adjust the path as needed

const UserSettings = () => {
  
  // Change Password Modal
  const handleChangePassword = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Password',
      html: `
        <input id="swal-old-password" type="password" class="swal2-input" placeholder="Old Password">
        <input id="swal-new-password" type="password" class="swal2-input" placeholder="New Password">
        <input id="swal-confirm-password" type="password" class="swal2-input" placeholder="Confirm New Password">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const oldPassword = document.getElementById('swal-old-password').value.trim();
        const newPassword = document.getElementById('swal-new-password').value.trim();
        const confirmPassword = document.getElementById('swal-confirm-password').value.trim();
        if (!oldPassword || !newPassword || !confirmPassword) {
          Swal.showValidationMessage('All fields are required');
        }
        if (newPassword !== confirmPassword) {
          Swal.showValidationMessage('New passwords do not match');
        }
        return { oldPassword, newPassword };
      }
    });

    if (formValues) {
      try {
        document.body.style.cursor = 'wait';
        // Replace the URL and payload with your actual endpoint and parameters
        const response = await httpClient.put('/api/user/change_password', {
          old_password: formValues.oldPassword,
          new_password: formValues.newPassword
        });
        if(response.status === 200){
          Swal.fire('Success', 'Password changed successfully', 'success');
        } else {
          throw new Error('Error updating password');
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to change password', 'error');
      } finally {
        document.body.style.cursor = 'default';
      }
    }
  };

  // Change Color Mode Modal
  const handleChangeColorMode = async () => {
    const { value: colorMode } = await Swal.fire({
      title: 'Change Color Mode',
      input: 'select',
      inputOptions: {
        light: 'Light Mode',
        dark: 'Dark Mode',
      },
      inputPlaceholder: 'Select color mode',
      showCancelButton: true,
      preConfirm: (value) => {
        if (!value) {
          Swal.showValidationMessage('You must select a color mode');
        }
        return value;
      }
    });

    if (colorMode) {
      try {
        document.body.style.cursor = 'wait';
        // Replace with your actual endpoint and payload.
        const response = await httpClient.put('/api/user/change_color_mode', { color_mode: colorMode });
        if(response.status === 200){
          Swal.fire('Success', 'Color mode updated successfully', 'success');
        } else {
          throw new Error('Error updating color mode');
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to update color mode', 'error');
      } finally {
        document.body.style.cursor = 'default';
      }
    }
  };

  // Change Email and Contact Info Modal
  const handleChangeEmailContact = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Change Email & Contact Info',
      html: `
        <input id="swal-new-email" type="email" class="swal2-input" placeholder="New Email Address">
        <input id="swal-new-contact" type="text" class="swal2-input" placeholder="New Contact Number">
      `,
      focusConfirm: false,
      showCancelButton: true,
      preConfirm: () => {
        const email = document.getElementById('swal-new-email').value.trim();
        const contact = document.getElementById('swal-new-contact').value.trim();
        if (!email || !contact) {
          Swal.showValidationMessage('Both email and contact number are required');
        }
        return { email, contact };
      }
    });

    if (formValues) {
      try {
        document.body.style.cursor = 'wait';
        // Replace with your actual update endpoint and payload.
        const response = await httpClient.put('/api/user/update_contact', {
          email: formValues.email,
          contact: formValues.contact
        });
        if(response.status === 200){
          Swal.fire('Success', 'Email and contact info updated successfully', 'success');
        } else {
          throw new Error('Error updating info');
        }
      } catch (error) {
        Swal.fire('Error', error.response?.data?.message || 'Failed to update info', 'error');
      } finally {
        document.body.style.cursor = 'default';
      }
    }
  };

  return (
    <div className="user-settings">
      <h3>User Settings</h3>
      <div className="settings-options">
        <button className="btn btn-primary" onClick={handleChangePassword}>
          Change Password
        </button>
        <button className="btn btn-primary" onClick={handleChangeColorMode}>
          Change Color Mode
        </button>
        <button className="btn btn-primary" onClick={handleChangeEmailContact}>
          Change Email & Contact Info
        </button>
      </div>
    </div>
  );
};

export default UserSettings;
