const isEmailValid = (email) =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const handlePasswordValidation = (password) => {
  const errors = [];

  // Check if password has at least one uppercase letter
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must have at least 1 uppercase letter');
  }

  // Check if password has at least one lowercase letter
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must have at least 1 lowercase letter');
  }

  // Check if password has at least one digit
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must have at least 1 digit');
  }

  // Check if password has at least one special character
  if (!/(?=.*[^a-zA-Z0-9])/.test(password)) {
    errors.push('Password must have at least 1 special character');
  }

  return errors;
};

export const handleEmailValidation = (email, error) => {
  const isValid = isEmailValid(email);

  const validityChanged = (error && isValid) || (!error && isValid);

  return validityChanged && isValid;
};
