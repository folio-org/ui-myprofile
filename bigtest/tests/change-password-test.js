import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { describeApplication } from '../helpers/describe-application';
import ChangePasswordPage from '../interactors/change-password';

describeApplication('ChangePasswordPage', () => {
  beforeEach(function () {
    return this.visit('/settings/myprofile/password', () => {
      expect(ChangePasswordPage.isPresent).to.be.true;
    });
  });

  it('has a current password field', () => {
    expect(ChangePasswordPage.currentPasswordField.isPresent).to.be.true;
    expect(ChangePasswordPage.currentPasswordField.type).to.equal('password');
  });

  it('has a new password field', () => {
    expect(ChangePasswordPage.newPasswordField.isPresent).to.be.true;
    expect(ChangePasswordPage.currentPasswordField.type).to.equal('password');
  });

  it('has a confirm password field', () => {
    expect(ChangePasswordPage.confirmPasswordField.isPresent).to.be.true;
    expect(ChangePasswordPage.confirmPasswordField.type).to.equal('password');
  });

  it('has an add show/hide button', () => {
    expect(ChangePasswordPage.hasShowHideButton).to.be.true;
  });

  describe('toggle mask', () => {
    beforeEach(async () => {
      await ChangePasswordPage.toggle();
    });

    it('checks toggled button text', () => {
      expect(ChangePasswordPage.toggleMask.text).to.equal('Hide password');
    });

    it('changes the type of the form fields to text', () => {
      expect(ChangePasswordPage.currentPasswordField.type).to.equal('text');
      expect(ChangePasswordPage.newPasswordField.type).to.equal('text');
      expect(ChangePasswordPage.confirmPasswordField.type).to.equal('text');
    });

    describe('changes the type of the form fields from text to password', () => {
      beforeEach(async () => {
        await ChangePasswordPage.toggle();
      });

      it('checks untoggled button text', () => {
        expect(ChangePasswordPage.toggleMask.text).to.equal('Show password');
      });

      it('changes the type of the form fields from text to password', () => {
        expect(ChangePasswordPage.currentPasswordField.type).to.equal('password');
        expect(ChangePasswordPage.newPasswordField.type).to.equal('password');
        expect(ChangePasswordPage.confirmPasswordField.type).to.equal('password');
      });
    });
  });

  describe('validation', () => {
    describe('current password', () => {
      beforeEach(async () => {
        const password = ChangePasswordPage.currentPasswordField;
        await password.fillInput('a');
        await password.fillInput('');
        await password.blurInput();
      });

      it('current password should have error message upon blur when there is no value there', () => {
        expect(ChangePasswordPage.currentPasswordField.errorMessage.text).to.equal('Please enter a value.');
      });
    });

    describe('new password', () => {
      beforeEach(async () => {
        const password = ChangePasswordPage.newPasswordField;
        await password.fillInput('a');
        await password.fillInput('');
        await password.blurInput();
      });

      it('new password should have error message upon blur when there is no value there', () => {
        expect(ChangePasswordPage.newPasswordField.errorMessage.text).to.equal('Please enter a value.');
      });
    });

    describe('confirm password', () => {
      describe('required validation', () => {
        beforeEach(async () => {
          const password = ChangePasswordPage.confirmPasswordField;
          await password.fillInput('a');
          await password.fillInput('');
          await password.blurInput();
        });

        it('confirm password should have error message upon blur when there is no value there', () => {
          expect(ChangePasswordPage.confirmPasswordField.errorMessage.text).to.equal('Please enter a value.');
        });
      });
    });

    describe('new and confirm passwords validation fail', () => {
      beforeEach(async () => {
        const newPassword = ChangePasswordPage.newPasswordField;
        const confirmPassword = ChangePasswordPage.confirmPasswordField;

        await newPassword.fillInput('a');
        await confirmPassword.fillInput('aa');
        await confirmPassword.blurInput();
      });

      it('confirm password should have error message upon blur when it does not match the new password and both field are filled', () => {
        expect(ChangePasswordPage.confirmPasswordField.errorMessage.text).to.equal('New and confirm password does not match. Retype your password.');
      });
    });

    describe('new and confirm passwords validation pass', () => {
      beforeEach(async () => {
        const newPassword = ChangePasswordPage.newPasswordField;
        const confirmPassword = ChangePasswordPage.confirmPasswordField;

        await newPassword.fillInput('aa');
        await confirmPassword.fillInput('aa');
        await confirmPassword.blurInput();
      });

      it('confirm password should not have error message upon blur when it does not match the new password and both field are filled', () => {
        expect(ChangePasswordPage.confirmPasswordField.errorMessage.isPresent).to.be.false;
      });
    });
  });

  describe('submit', () => {
    beforeEach(async () => {
      const currentPassword = ChangePasswordPage.currentPasswordField;
      const newPassword = ChangePasswordPage.newPasswordField;
      const confirmPassword = ChangePasswordPage.confirmPasswordField;

      await currentPassword.fillInput('current');
      await newPassword.fillInput('new');
      await confirmPassword.fillInput('new');
      await ChangePasswordPage.saveBtn();
    });

    it('all fields should be reset upon successful submit', () => {
      expect(ChangePasswordPage.currentPasswordField.value).to.equal('');
      expect(ChangePasswordPage.newPasswordField.value).to.equal('');
      expect(ChangePasswordPage.confirmPasswordField.value).to.equal('');
    });
  });
});
