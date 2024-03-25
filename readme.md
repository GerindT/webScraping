> Welcome to Scamless a website/tool to analyze the credibility of amazon products

## Technologies used:

### Frontend:

- React js Bootstrapped by Vite
- Tailwind Css with Flowbite
- Eslint and Prettier

> Bootstrapped by vite webpack

### Backend:

- Two api-s, one build with Node js and one with Flask
- Puppeteer and Node js for web scraping and managing the app flow
- Flask with hugging face transformers, pipelines and nltk and sklearn for NLP Models

> Bootstrapped by node js and flask environments

## Features:

The web app objective is to achieve a multi-modal application that uses web scraping to feed the fine tuned nlp sentimental analysis model, and the tfidf embedding to produce statistic and analyze them.

- Web scraping and web crawling powered by Pupetter
- Custom api endpoints with cors and regex to achive better results
- Scraping all the information for a product, its description and all the reviews (up to 500 since that is the amazon limit)
- Crawling to top 3 possible desired products for the user based on hte feature extraction
- Sentimental analysis model, fine tuned from distilbert with a 400'000 record dataset
- Fined tuning done using state of the art transformer and pipline methods provided by hugging face
- Feature extraction done based on TFIDF method, using the scraped data and sentimental analysis done to it
- SPA build with react, with customisable setting for the user to choose what to see
- Graphs, statics and analysis shown using Apache graphs, calculation done in hte node js api, and aggreations.

## API Endpoints:

> There are to apis as stated before

#### Node js:

- /api/data -> Used to start the scraping of the data, goes through all the reviews for that product, if eligible.

#### Flask:

- /api -> Used to map the reviews with a sentimental score, generate the aggregated sentimental score for each sentiment and also do the feature extraction

## Running locally:

### Frontend

> Prerequisite Node v14 and up

Run command:

- `npm i`

- `npm run dev`

> Fronted endpoint **localhost:5173**

### Backend - Node JS:

- `npm i`

- `npm run dev`

> Backend endpoint **localhost:3000**

### Backend - Flask:

- Create a venv `python -m venv .venv`

- Active it:

  - If windows `.venv\Scripts\activate`
  - If linux `source .venv/bin/activate`

- In the activated venv `flask run`

> Backend endpoint **127.0.0.1:4000**

## Deployment:

### Frontend

Netlify using netlify cli

- `npm run build`

- `ntl deploy --prod`

### Backend:

- Dockerfile to run node js and puppeteer hosted in `render.com`

- Flask app still in development

## Enjoy 🥳

![cofi](https://swisscognitive.ch/wp-content/uploads/2019/10/giphy.gif)
