import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import passwordValidationTranslation from '@folio/stripes-smart-components/translations/stripes-smart-components/en';
import translation from '../../../translations/ui-myprofile/en';
import setupApplication from '../helpers/setup-application';
import ChangePasswordPage from '../interactors/change-password';
import { wrongPassword, serverError, userData, lastTenPasswordsError, multipleErrors } from '../constants';

// success message from translation, parsed from string representation of JSX, with user data
const successMessage = (() => {
  const message = translation['settings.changePassword.successfullyChanged'];
  const parsedMessage = new DOMParser().parseFromString(message, 'text/html').body.textContent || '';

  return Object.keys(userData).reduce((res, key) => {
    return res.includes(key) ? res.replace(`{${key}}`, userData[key]) : res;
  }, parsedMessage);
})();

describe('ChangePasswordPage', () => {
  setupApplication();

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
      expect(ChangePasswordPage.toggleMask.text).to.equal(translation['settings.changePassword.hidePassword']);
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
        expect(ChangePasswordPage.toggleMask.text).to.equal(translation['settings.changePassword.showPassword']);
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
        expect(ChangePasswordPage.currentPasswordField.errorMessage.text).to.equal(
          translation['settings.changePassword.enterValue']
        );
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
        expect(ChangePasswordPage.newPasswordField.errorMessage.text).to.equal(
          translation['settings.changePassword.enterValue']
        );
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
          expect(ChangePasswordPage.confirmPasswordField.errorMessage.text).to.equal(
            translation['settings.changePassword.enterValue']
          );
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
        expect(ChangePasswordPage.confirmPasswordField.errorMessage.text).to.equal(
          translation['settings.changePassword.confirmPasswordMatchError']
        );
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

    it('success message should be shown upon successful submit', () => {
      expect(ChangePasswordPage.successMessage.isPresent).to.be.true;
    });

    it('success message should have proper text', () => {
      expect(ChangePasswordPage.successMessage.text).to.equal(successMessage);
    });
  });

  describe('validation error for the incorrect current password', () => {
    beforeEach(async () => {
      const currentPassword = ChangePasswordPage.currentPasswordField;
      const newPassword = ChangePasswordPage.newPasswordField;
      const confirmPassword = ChangePasswordPage.confirmPasswordField;

      await currentPassword.fillInput(wrongPassword);
      await newPassword.fillInput('newPassword');
      await confirmPassword.fillInput('newPassword');
      await ChangePasswordPage.saveBtn();
    });

    it('all fields should not be reset upon failed submit', () => {
      expect(ChangePasswordPage.currentPasswordField.value).to.equal(wrongPassword);
      expect(ChangePasswordPage.newPasswordField.value).to.equal('newPassword');
      expect(ChangePasswordPage.confirmPasswordField.value).to.equal('newPassword');
    });

    it('validation error should be present upon failed submit', () => {
      expect(ChangePasswordPage.currentPasswordField.errorMessage.isPresent).to.exist;
      expect(ChangePasswordPage.currentPasswordField.errorMessage.text).to.equal(
        translation['settings.changePassword.wrongPassword']
      );
    });
  });

  describe('server error upon form submit', () => {
    beforeEach(async () => {
      const currentPassword = ChangePasswordPage.currentPasswordField;
      const newPassword = ChangePasswordPage.newPasswordField;
      const confirmPassword = ChangePasswordPage.confirmPasswordField;

      await currentPassword.fillInput(serverError);
      await newPassword.fillInput('newPassword');
      await confirmPassword.fillInput('newPassword');
      await ChangePasswordPage.saveBtn();
    });

    it('nothing happens upon server error', () => {
      expect(ChangePasswordPage.currentPasswordField.value).to.equal('');
      expect(ChangePasswordPage.newPasswordField.value).to.equal('');
      expect(ChangePasswordPage.confirmPasswordField.value).to.equal('');
      expect(ChangePasswordPage.successMessage.isPresent).to.be.false;
      expect(ChangePasswordPage.confirmPasswordField.errorMessage.isPresent).to.be.false;
    });
  });

  describe('validation error for the incorrect new password, last ten passwords error', () => {
    beforeEach(async () => {
      const currentPassword = ChangePasswordPage.currentPasswordField;
      const newPassword = ChangePasswordPage.newPasswordField;
      const confirmPassword = ChangePasswordPage.confirmPasswordField;

      await currentPassword.fillInput(lastTenPasswordsError);
      await newPassword.fillInput('newPassword');
      await confirmPassword.fillInput('newPassword');
      await ChangePasswordPage.saveBtn();
    });

    it('all fields should not be reset upon failed submit', () => {
      expect(ChangePasswordPage.currentPasswordField.value).to.equal(lastTenPasswordsError);
      expect(ChangePasswordPage.newPasswordField.value).to.equal('newPassword');
      expect(ChangePasswordPage.confirmPasswordField.value).to.equal('newPassword');
    });

    it('validation error should be present upon failed submit', () => {
      expect(ChangePasswordPage.newPasswordField.errorMessage.isPresent).to.be.true;
      expect(ChangePasswordPage.newPasswordField.errorMessage.text).to.equal(
        passwordValidationTranslation['password.lastTenPasswords.invalid']
      );
    });
  });

  describe('validation error for the incorrect new password, multiple errors', () => {
    beforeEach(async () => {
      const currentPassword = ChangePasswordPage.currentPasswordField;
      const newPassword = ChangePasswordPage.newPasswordField;
      const confirmPassword = ChangePasswordPage.confirmPasswordField;

      await currentPassword.fillInput(multipleErrors);
      await newPassword.fillInput('newPassword');
      await confirmPassword.fillInput('newPassword');
      await ChangePasswordPage.saveBtn();
    });

    it('all fields should not be reset upon failed submit', () => {
      expect(ChangePasswordPage.currentPasswordField.value).to.equal(multipleErrors);
      expect(ChangePasswordPage.newPasswordField.value).to.equal('newPassword');
      expect(ChangePasswordPage.confirmPasswordField.value).to.equal('newPassword');
    });

    it('validation error should be present upon failed submit', () => {
      expect(ChangePasswordPage.newPasswordField.errorMessage.isPresent).to.be.true;
      expect(ChangePasswordPage.newPasswordField.errorMessage.text).to.equal(
        `${passwordValidationTranslation['password.repeatingSymbols.invalid']}${
          passwordValidationTranslation['password.whiteSpace.invalid']
        }`
      );
    });
  });
});
