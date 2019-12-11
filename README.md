# cvd.id.au

[![CircleCI](https://circleci.com/gh/cvandal/cvd.id.au.svg?style=svg)](https://circleci.com/gh/cvandal/cvd.id.au)

## Dependencies

1. Download, and install [Hugo](https://github.com/gohugoio/hugo/releases)
2. Download, and install [Node.js](https://nodejs.org/en/download)
3. Download, and install the `markdown-proofing` NPM package:

   ```bash
   npm install -g markdown-proofing
   ```

4. Download, install, and configure the Firebase CLI:

   ```bash
   npm install -g firebase-tools
   firebase login
   ```

## Development

1. Run `hugo server`, and browse to [http://localhost:1313](http://localhost:1313)

## Testing

1. Run `npm test`

## Deploy

1. Run `hugo`
2. Run `firebase deploy`
