/* @flow */

import { Platform } from 'react-native';
import pkg from '../../package.json';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': `${pkg.name}/${pkg.version} ${Platform.OS}/${Platform.Version}`,
};
const apiHost = 'https://mc.escemo.com';
const loginUrl = `${apiHost}/tokens`;

// eslint-disable-next-line import/prefer-default-export
export function login(options) {
  return fetch(loginUrl, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify({
      email: options.email,
      password: options.password,
    }),
  }).then(processResponse);
}

// Private methods

function processResponse(response) {
  let isOk = response.ok;

  return response.text().then(text => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (error) {
      isOk = false;
    }

    if (isOk) return parsed;

    let errorMessage = 'Uh-oh, got an error';
    if (parsed && parsed.message) errorMessage = parsed.message;
    const error = new Error(errorMessage);

    if (parsed) error.body = parsed;

    throw error;
  });
}
