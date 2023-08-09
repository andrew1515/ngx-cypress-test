FROM cypress/browsers:node-18.16.1-chrome-114.0.5735.133-1-ff-114.0.2-edge-114.0.1823.51-1

WORKDIR /app

COPY ./package.json ./package-lock.json ./

RUN npm ci --force

COPY . .

RUN npx cypress verify

CMD npm run cypress:e2e:ci
