# Open Collective Taxes

[![codecov](https://codecov.io/gh/opencollective/opencollective-taxes/branch/main/graph/badge.svg)](https://codecov.io/gh/opencollective/opencollective-taxes)
![GitHub](https://img.shields.io/github/license/opencollective/opencollective-taxes)
[![Discord](https://discordapp.com/api/guilds/1241017531318276158/widget.png)](https://discord.opencollective.com)

## Foreword

If you see a step below that could be improved (or is outdated), please update the instructions. We rarely go through this process ourselves, so your fresh pair of eyes and your recent experience with it, makes you the best candidate to improve them for other users. Thank you!

## Development

### Prerequisite

1. Make sure you have Node.js version >= 18.

- We recommend using [nvm](https://github.com/creationix/nvm): `nvm use`.

### Install

We recommend cloning the repository in a folder dedicated to `opencollective` projects.

```
git clone git@github.com:opencollective/opencollective-taxes.git opencollective/taxes
cd opencollective/taxes
npm install
```

## Release

1. Bump version with `npm version {patch|minor|major}`
2. Run `npm run build`
3. Run `npm publish`

## Contributing

Code style? Commit convention? Please check our [Contributing guidelines](CONTRIBUTING.md).

TL;DR: we use [Prettier](https://prettier.io/) and [ESLint](https://eslint.org/), we do like great commit messages and clean Git history.

## Tests

You can run the tests using `npm test` or `npm run test:watch` (for TDD).

## Discussion

If you have any questions, ping us on [Discord](https://discord.opencollective.com) or Twitter
([@opencollect](https://twitter.com/opencollect)).
