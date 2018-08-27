import {
  action,
  interactor,
  isPresent,
  attribute,
  clickable,
  scoped,
  text,
  value,
} from '@bigtest/interactor';

@interactor class ToggleMask {
  toggleMaskBtn = clickable('button');
  text = text('button');
}

@interactor class InputField {
  type = attribute('input', 'type');
  value = value('input', 'type');
  errorMessage = scoped('[class^="feedbackError--"]');

  fillInput = action(function (val) {
    return this.fill('input', val);
  });

  blurInput = action(function () {
    return this.blur('input');
  });
}

@interactor class ChangePasswordPage {
  currentPasswordField = new InputField('[data-test-change-password-current-password-field]');
  newPasswordField = new InputField('[data-test-change-password-new-password-field]');
  confirmPasswordField = new InputField('[data-test-change-password-confirm-password-field]');

  hasShowHideButton = isPresent('[data-test-change-password-toggle-mask-btn] button');

  saveBtn = clickable('button[type=submit]');
  toggleMask = new ToggleMask('[data-test-change-password-toggle-mask-btn]');
  toggle = action(function () {
    return this.toggleMask.toggleMaskBtn();
  });
}

export default new ChangePasswordPage('[data-test-change-password-page]');
