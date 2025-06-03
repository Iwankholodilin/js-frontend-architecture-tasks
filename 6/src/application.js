import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default () => {
  const rootElem = document.querySelector('[data-container="sign-up"]');
  const signupElem = rootElem.querySelector('[data-form="sign-up"]');
  const submitBtnElem = signupElem.querySelector('input[type="submit"]');
  const initialData = {
    form: { name: '', email: '', password: '', passwordConfirmation: '' },
    fieldErrs: {},
    isFormValid: false,
    submitStatus: 'filling',
  };
  const observedState = onChange(initialData, (path) => {
    if (path === 'form') {
      const errs = validate(observedState.form);
      observedState.fieldErrs = errs;
      observedState.isFormValid = isEmpty(errs);
    }
    if (path === 'fieldErrs' || path === 'isFormValid') {
      updateSignupFormView(signupElem, observedState);
    }
    if (path === 'submitStatus') {
      switch (observedState.submitStatus) {
        case 'processing':
          submitBtnElem.disabled = true;
          break;
        case 'finished':
          rootElem.innerHTML = 'User Created!';
          break;
        case 'error':
          submitBtnElem.disabled = false;
          break;
        case 'filling':
          submitBtnElem.disabled = !observedState.isFormValid;
          break;
        default:
          throw new Error(`Unknown process state: ${observedState.submitStatus}`);
      }
    }
  });
  const updateSignupFormView = (formEl, state) => {
    const formFields = Array.from(formEl.elements).filter(el => el.name);
    formFields.forEach(field => {
      const errKey = field.name;
      const err = state.fieldErrs[errKey];
      if (err) {
        field.classList.add('is-invalid');
        let feedbackEl = field.nextElementSibling;
        if (!feedbackEl || !feedbackEl.classList.contains('invalid-feedback')) {
          feedbackEl = document.createElement('div');
          feedbackEl.classList.add('invalid-feedback');
          field.after(feedbackEl);
        }
        feedbackEl.textContent = err.message;
      } else {
        field.classList.remove('is-invalid');
        let feedbackEl = field.nextElementSibling;
        if (feedbackEl && feedbackEl.classList.contains('invalid-feedback')) {
          feedbackEl.remove();
        }
      }
    });
    submitBtnElem.disabled = !state.isFormValid || observedState.submitStatus === 'processing';
  };
  signupElem.addEventListener('input', (e) => {
    const { target } = e;
    observedState.form = {
      ...observedState.form,
      [target.name]: target.value,
    };
  });
  signupElem.addEventListener('submit', (e) => {
    e.preventDefault();
    observedState.submitStatus = 'processing';
    axios
      .post(routes.usersPath(), observedState.form)
      .then(() => {
        observedState.submitStatus = 'finished';
      })
      .catch((err) => {
        console.error('Submission error:', err);
        let errorMessage = errorMessages.network.error;
        if (err.response && err.response.status === 409) {
          errorMessage = 'This email is already registered';
        }
        observedState.submitStatus = 'error';
      });
  });
  updateSignupFormView(signupElem, observedState);
};
// END
