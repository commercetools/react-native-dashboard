/* @flow */

const apiHost = 'https://mc.commercetools.com'
const loginUrl = `${apiHost}/tokens`

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
