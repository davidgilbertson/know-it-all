# Know it all

[know-it-all.io](https://know-it-all.io/)

The goal of know-it-all is to help you discover things 
that you don't know about web development.

And maybe one day about other things too.

## Running it locally
1. fork it/clone it `git clone https://github.com/davidgilbertson/know-it-all.git`
2. `npm i`
3. Before running in dev mode for the very first time, you must do a build (`npm run build`)
4. `npm run dev` to start up the webpack dev server, then head to `localhost:8080`
5. `npm run build` to build the production bundles
6. `npm start` to start in production mode, also at `localhost:8080`. Note that this
is hosted as a static site, so the production build just starts a very simple little NodeJS server.

## Planned stuff
- View a list of all "Don't know" and/or "Know of it" items.
- Counts of scores (e.g. Don't know: 43, unrated: 8,723, etc)
- Links to docs for each item. Maybe.
- Search the list

## Contributing
I'd be delighted to get help from the greater community, I imagine
in typing out all that data I made some mistakes. Typos etc you
can go right ahead and do a PR. For any architectural change open
an issue and let's chat about it first.

PRs that degrade performance will not be accepted.
