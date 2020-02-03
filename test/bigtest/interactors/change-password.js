import {
  action,
  Interactor,
  interactor,
  isPresent,
  clickable,
} from '@bigtest/interactor';

import ToggleMask from './toggle-mask';
import InputField from './input-field';

@interactor class ChangePasswordPage {
  currentPasswordField = new InputField('[data-test-change-password-current-password-field]');
  newPasswordField = new InputField('[data-test-change-password-new-password-field]');
  confirmPasswordField = new InputField('[data-test-change-password-confirm-password-field]');
  successMessage = new Interactor('[class^="calloutRow--"]');

  hasShowHideButton = isPresent('[data-test-change-password-toggle-mask-btn] button');

  saveBtn = clickable('button[type=submit]');
  toggleMask = new ToggleMask('[data-test-change-password-toggle-mask-btn]');
  toggle = action(function () {
    return this.toggleMask.toggleMaskBtn();
  });
}

export default new ChangePasswordPage('[data-test-change-password-page]');
