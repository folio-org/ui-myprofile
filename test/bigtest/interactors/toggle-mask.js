import {
  clickable,
  interactor,
  text,
} from '@bigtest/interactor';

@interactor class ToggleMask {
  toggleMaskBtn = clickable('button');
  text = text('button');
}

export default ToggleMask;
