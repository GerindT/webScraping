from flask import Flask, request, jsonify
import os
from flask_cors import CORS

# Import necessary libraries for sentiment analysis
from transformers import pipeline
import pandas as pd

model_id = "GerindT/distilbert-emotion-mini-amazon"
classifier = pipeline("text-classification", model= model_id, max_length=512)

# Import necessary libraries for TF-IDF vectorization and text preprocessing
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Download NLTK resources if not already downloaded
import nltk
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

# Load stop words and initialize lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

# Custom tokenizer function
def custom_tokenizer(text):
    tokens = word_tokenize(text)  # Tokenize the text
    tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens if token.isalpha() and len(token) > 3]  # Lemmatize tokens, remove non-alphabetic tokens, and filter out tokens with length less than 3
    tokens = [token for token in tokens if token not in stop_words]  # Remove stop words
    return tokens

app = Flask(__name__)   
flask_env = os.getenv('FLASK_ENV')
print(f'Running in {flask_env} mode')

origin = 'http://localhost:3000' if flask_env == "development" else 'https://scamless-backend.onrender.com'
print(f'Origin: {origin}')
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

    # Analyze sentiment for each review
    analyzed_reviews = []
    for review in total_reviews:
        title = review.get('ratingDescription', '')
        text = review.get('reviewText', '')
        
        # Check if title or text is None, and if so, treat them as empty strings
        if title is None:
            title = ''
        if text is None:
            text = ''
        
        review_text = title + " " + text
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

    # Filter out reviews with None values for reviewText
    reviews_with_text = [review for review in analyzed_reviews if review.get('reviewText') is not None]

    # Separate the data based on labels
    reviews_label_01 = [review['reviewText'] for review in reviews_with_text if review['sentiment'] in ["LABEL_0", "LABEL_1"]]
    reviews_label_23 = [review['reviewText'] for review in reviews_with_text if review['sentiment'] in ["LABEL_2", "LABEL_3"]]

    # Initialize TF-IDF vectorizers with custom tokenizer and other parameters for each set of labels
    vectorizer_01 = TfidfVectorizer(tokenizer=custom_tokenizer, min_df=3, max_df=0.8, max_features=10)
    vectorizer_23 = TfidfVectorizer(tokenizer=custom_tokenizer, min_df=3, max_df=0.8, max_features=10)

    # Fit the vectorizers on the review text arrays
    vectorizer_01.fit(reviews_label_01)
    vectorizer_23.fit(reviews_label_23)


    print(vectorizer_01.get_feature_names_out())
    print(vectorizer_23.get_feature_names_out())


    # Get feature names from vectorizer_01 and vectorizer_23
    feature_names_01 = set(vectorizer_01.get_feature_names_out())
    feature_names_23 = set(vectorizer_23.get_feature_names_out())

    # Merge the feature names sets
    merged_feature_names = feature_names_01.union(feature_names_23)

    # Now you can use merged_feature_names set for further processing
    print(merged_feature_names)


    
    # csv_filename = "analyzed_reviews.csv"
    # with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
    #     fieldnames = ['reviewText', 'score', 'sentiment']
    #     writer = csv.DictWriter(file, fieldnames=fieldnames)
    #     writer.writeheader()
    #     for review in analyzed_reviews:
    #         writer.writerow({'reviewText': review['reviewText'],
    #                          'score': review['score'],
    #                          'sentiment': review['sentiment']})

    description_features = []


    if(request_data['data'][0]['description'] is not None and request_data['data'][0]['description'] != ""):
        vectorizer_desc = TfidfVectorizer(tokenizer=custom_tokenizer, min_df=1, max_df=1.0, max_features=10)
        vectorizer_desc.fit([request_data['data'][0]['description']])
        description_features.append(list(vectorizer_desc.get_feature_names_out()))

    if((request_data['data'][0]['generalDescriptionItem'] is not None and request_data['data'][0]['generalDescriptionItem'] != "") ):
        vectorizer_desc = TfidfVectorizer(tokenizer=custom_tokenizer, min_df=1, max_df=1.0, max_features=10)
        vectorizer_desc.fit([request_data['data'][0]['generalDescriptionItem']])
        description_features.append(list(vectorizer_desc.get_feature_names_out()))

    if((request_data['data'][0]['descriptionItem'] is not None and request_data['data'][0]['descriptionItem'] != "") ):
        vectorizer_desc = TfidfVectorizer(tokenizer=custom_tokenizer, min_df=1, max_df=1.0, max_features=10)
        vectorizer_desc.fit([request_data['data'][0]['descriptionItem']])
        description_features.append(list(vectorizer_desc.get_feature_names_out()))

    if((request_data['data'][0]['productDetails'] is not None and len(request_data['data'][0]['productDetails']))>0  ):
        for detail_dict in request_data['data'][0]['productDetails']:
                for detail_value in detail_dict.values():
                    description_features.append(detail_value)

    if((request_data['data'][0]['generalProductDetails'] is not None and len(request_data['data'][0]['generalProductDetails']))>0  ):

        for detail_dict in request_data['data'][0]['generalProductDetails']:
            for detail_value in detail_dict.values():
                description_features.append(detail_value)

        
    def flatten(data):
        """
        Flattens a nested list.

        Args:
            data: The nested list to flatten.

        Returns:
            A list containing the elements of the nested list in a single dimension.
        """
        flat_list = []
        for item in data:
            if isinstance(item, list):
                flat_list.extend(flatten(item))
            else:
                flat_list.append(item)
        return flat_list


    
    # Update the request data with the analyzed reviews
    request_data['totalreviews'] = analyzed_reviews
    request_data['data'][0]['sentiment'] = sentiment_results
    request_data['data'][0]['keyword'] = list(merged_feature_names)
    request_data['data'][0]['descriptionFeatures'] = flatten(description_features)



    
   

    # Return the parameter as JSON response
    return jsonify({'param_from_nodejs': request_data}), 200