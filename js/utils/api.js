/* @flow */

const apiHost = 'https://mc.commercetools.com'
const loginUrl = `${apiHost}/tokens`
const projectsByUserUrl = `${apiHost}/projects`

export function login (options) {
  return fetch(
    loginUrl,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: options.email,
        password: options.password,
      }),
    },
  ).then(processResponse)
}

export function getProjectsForUser (options) {
  return fetch(
    `${projectsByUserUrl}?userId=${options.userId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: options.token,
        'Content-Type': 'application/json',
      },
    },
  ).then(processResponse)
}

// Fetch some meta information to show in the dashboard:
// - tot number of orders
// - tot number of customers
// - tot number of carts
// - tot number of products
// - tot number of categories
export function statistics (options) {
  // return fetch(
  //   loginUrl,
  //   {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       email: options.email,
  //       password: options.password,
  //     }),
  //   },
  // ).then(processResponse)
}


// Private methods

function processResponse (response) {
  let isOk = response.ok

  return response.text()
  .then((text) => {
    let parsed
    try { parsed = JSON.parse(text) } catch (error) { isOk = false }

    if (isOk) return parsed

    // loggers.app.info(response.headers.raw())

    const error = new Error(parsed ? parsed.message : text)

    if (parsed) error.body = parsed

    throw error
  })
}
