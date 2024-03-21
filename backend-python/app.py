from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import torch
import numpy as np
import csv
from transformers import pipeline

model_id = "GerindT/distilbert-emotion-mini-amazon"
classifier = pipeline("text-classification", model= model_id)


app = Flask(__name__)   
flask_env = os.getenv('FLASK_ENV')
print(f'Running in {flask_env} mode')

origin = flask_env == "development" if 'http://localhost:3000' else 'https://amazon-review-sentiment-analysis.herokuapp.com'

CORS(app, resources={r"/api/*": {"origins": origin}})

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/api',methods=['POST'])
def api():


    # Get JSON data from the request body
    request_data = request.get_json()

    # Extract totalreviews from the request data
    total_reviews = request_data['data'][0]['totalreviews']
    print(total_reviews)

    # Analyze sentiment for each review
    analyzed_reviews = []
    for review in total_reviews:
        title = review.get('ratingDescription', '')
        text = review.get('reviewText', '')
        if title:
            review_text = title + " " + text
        else:
            review_text = text
        value = classifier(review_text)
        print(value)
        review['score'] = value[0]['score']
        review['sentiment'] = value[0]['label']
        analyzed_reviews.append(review)
    
    sentiment = [review['sentiment'] for review in analyzed_reviews]
    sentiment_results = {
       'negative':  sentiment.count('LABEL_0'),
       'neutral': sentiment.count('LABEL_1'),
       'positive': sentiment.count('LABEL_2'),
       'veryPositive': sentiment.count('LABEL_3'),
    }

    print(sentiment_results)


    
    # csv_filename = "analyzed_reviews.csv"
    # with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
    #     fieldnames = ['reviewText', 'score', 'sentiment']
    #     writer = csv.DictWriter(file, fieldnames=fieldnames)
    #     writer.writeheader()
    #     for review in analyzed_reviews:
    #         writer.writerow({'reviewText': review['reviewText'],
    #                          'score': review['score'],
    #                          'sentiment': review['sentiment']})


    # Update the request data with the analyzed reviews
    request_data['totalreviews'] = analyzed_reviews
    request_data['data'][0]['sentiment'] = sentiment_results

    
   

    # Return the parameter as JSON response
    return jsonify({'param_from_nodejs': request_data}), 200