# Steam Auth Server

A simple Steam authentication server that can create refresh tokens, access tokens, and cookies for Steam.

## Features

- Create refresh tokens based on username, password, platform and optional 2FA code
- Create access tokens based on refresh token
- Create cookies based on refresh token
- Supports authentication platforms: web, client, mobile
- Supports proxy

## Installation

Clone the repository and install the dependencies:

```text
git clone
cd steam-auth-server

yarn install
yarn run build
```

## Usage

```text
yarn run start:prod
```

## Configuration

`.env`

```text
PORT=3000
STRICT_PROXY=false
```

- `PORT`: The port the server will listen on
- `STRICT_PROXY`: If set to true and proxy is not provided in the request, the server will return an error

## Endpoints

### POST /create/refresh-token

Creates a refresh token based on the username, password, platform and optional 2FA code.

```text
{
  "username": "username",
  "password": "password",
  "platform": "web", // one of web, desktop, mobile
  "guardCode": "optional 2FA code", // only required if 2FA is enabled,
  "sharedSecret": "optional shared secret", // only required if 2FA is enabled and guardCode is not provided,
  "proxy": "optional proxy url"
}
```

### POST /create/access-token

Creates access token based on refresh token and platform.

```text
{
  "refreshToken": "refresh token"
  "proxy": "optional proxy url"
}
```

### POST /create/cookies

Creates cookies based on refresh token.

```text
{
  "refreshToken": "refresh token",
  "proxy": "optional proxy url"
}
```

### GET /status

Returns status 200 and some useful information if the server is running.

## Requirements

- Node.js 18 or higher
