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

npm install

// or

yarn install --frozen-lockfile
```

## Usage

```text
npm run start:prod

// or

yarn start:prod
```

## Configuration

Only the port can be changed. To change it, set the PORT environment variable or change the port property in the .env file.

## Endpoints

### POST /create/refresh-token

Creates a refresh token based on the username, password, platform and optional 2FA code.

```text
{
  "username": "username",
  "password": "password",
  "platform": "web", // one of web, desktop, mobile
  "code": "optional 2FA code", // only required if 2FA is enabled
  "proxy": "optional proxy url"
}
```

### POST /create/access-token

Creates access token based on refresh token and platform.

```text
{
  "refreshToken": "refresh token"
  "platform": "web", // one of web, desktop, mobile
  "proxy": "optional proxy url"
}
```

### POST /create/cookie

Creates cookies based on refresh token.

```text
{
  "refreshToken": "refresh token",
  "proxy": "optional proxy url"
}
```

### GET /health

Returns status 200 and some useful information if the server is running.

## Requirements

- Node.js 16 or higher
