/* @flow */

import { Platform } from 'react-native';
import pkg from '../../package.json';

const defaultHeaders = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'User-Agent': `${pkg.name}/${pkg.version} ${Platform.OS}/${Platform.Version}`,
};
const apiHost = 'https://mc.commercetools.com';
const loginUrl = `${apiHost}/tokens`;
const userUrl = `${apiHost}/users`;
const projectsByUserUrl = `${apiHost}/projects`;

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

export function getUser(options) {
  return fetch(`${userUrl}/${options.userId}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: options.token,
    },
  }).then(processResponse);
}

export function getProjectsForUser(options) {
  return fetch(`${projectsByUserUrl}?userId=${options.userId}`, {
    method: 'GET',
    headers: {
      ...defaultHeaders,
      Authorization: options.token,
    },
  }).then(processResponse);
}

export function getStatisticsForThisWeek(options) {
  return fetch(`${apiHost}/mobile/${options.projectKey}/graphql`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      Authorization: options.token,
    },
    body: JSON.stringify({
      /* eslint-disable max-len */
      query: `
          query DashboardStatistics {
            statistics {
              lastWeekOrders: lastDaysStats(statType: ORDERS, numberOfDaysFromToday: 7) {
                total
                range {
                  dateFrom
                  dateTo
                }
                ... on OrderStat {
                  open
                  complete
                }
              }
              lastWeekCarts: lastDaysStats(statType: CARTS, numberOfDaysFromToday: 7) {
                total
                range {
                  dateFrom
                  dateTo
                }
                ... on CartStat {
                  ordered
                  active
                }
              }
            }
          }
        `,
      /* eslint-enable max-len */
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

    // loggers.app.info(response.headers.raw())

    let errorMessage = 'Uh-oh, got an error';
    if (parsed && parsed.message) errorMessage = parsed.message;
    const error = new Error(errorMessage);

    if (parsed) error.body = parsed;

    throw error;
  });
}
