import {
  action,
  attribute,
  interactor,
  scoped,
  value,
} from '@bigtest/interactor';

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

export default InputField;
