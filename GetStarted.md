## Node JS

install Node.js

## Git clone

From the welcome screen of the VS code click git clone and select COMP9034DevOps from Taka's Repo(rhapvn)

## run the command in the terminal

npm i

## Select Dev/Test branch

Check out to Dev/Test branch

## Database

Install PostgreSQL locally or register Vercel postgres

## .env.local template

#Vercel Postgres
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

NEXTAUTH_URL=
#Okta
AUTH_OKTA_ID=
AUTH_OKTA_SECRET=
AUTH_OKTA_ISSUER=

# AUTH_OKTA_ISSUER=

#Google
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
SECRET=

## How to test with Jest

#### Add to "package.json" and `npm i`

script:{
"test": "jest"
}
"devDependencies": {
"@testing-library/react": "^16.0.0",
"@types/jest": "^29.5.12",
"dotenv": "^16.4.5",
"jest": "^29.7.0",
"ts-jest": "^29.2.4",
"typescript": "^5.5.4"
}

#### or run

npm install --save-dev jest @testing-library/react dotenv ts-jest @types/jest typescript

#### Create "jest.config.js"

module.exports = {
preset: "ts-jest",
testEnvironment: "node",
transform: {
"^.+\\.tsx?$": "ts-jest",
},
moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};

#### Create "test" folder in the root

#### Create `filename`.test.js

require("dotenv").config({ path: ".env.local" });
const `function name` = require("../src/db/`file name`");

test('myFunction should return "Hello, World!"', async () => {
console.log(await `function name`.default());
});
