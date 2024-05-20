from flask import Flask, request, jsonify
import os
from flask_cors import CORS
from transformers import pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import nltk
import csv

# Download NLTK resources if not already downloaded
nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

# Initialize Flask app
app = Flask(__name__)
flask_env = os.getenv('FLASK_ENV')
print(f'Running in {flask_env} mode')

# Configure CORS
origin = 'http://localhost:3000' if flask_env == "development" else 'https://scamless-backend.onrender.com'
print(f'Origin: {origin}')
CORS(app, resources={r"/api/*": {"origins": origin}})

# Initialize sentiment analysis model
model_id = "GerindT/distilbert-emotion-mini-amazon"
classifier = pipeline("text-classification", model=model_id, max_length=512)

# Load stop words and initialize lemmatizer
stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()


def custom_tokenizer(text):
    """Custom tokenizer function"""
    tokens = word_tokenize(text)  
    tokens = [lemmatizer.lemmatize(token.lower()) for token in tokens if token.isalpha() and len(token) > 3]  
    tokens = [token for token in tokens if token not in stop_words]  
    return tokens


def write_analyzed_reviews_to_csv(analyzed_reviews):
    """Write analyzed reviews to CSV"""
    csv_filename = "analyzed_reviews.csv"
    with open(csv_filename, mode='w', newline='', encoding='utf-8') as file:
        fieldnames = ['reviewText', 'score', 'sentiment']
        writer = csv.DictWriter(file, fieldnames=fieldnames)
        writer.writeheader()
        for review in analyzed_reviews:
            writer.writerow({'reviewText': review['reviewText'],
                             'score': review['score'],
                             'sentiment': review['sentiment']})


@app.route('/')
def hello_world():
    """Root endpoint"""
    return 'Hello, World!'


@app.route('/api', methods=['POST'])
def api():
    """API endpoint"""
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

    # Write analyzed reviews to CSV
    write_analyzed_reviews_to_csv(analyzed_reviews)

    sentiment = [review['sentiment'] for review in analyzed_reviews]
    sentiment_results = {
        'negative': sentiment.count('LABEL_0'),
        'neutral': sentiment.count('LABEL_1'),
        'positive': sentiment.count('LABEL_2'),
        'veryPositive': sentiment.count('LABEL_3'),
    }
    print(sentiment_results)

    # Filter out reviews with None values for reviewText
    reviews_with_text = [review for review in analyzed_reviews if review.get('reviewText') is not None]

    # Separate the data based on labels
    reviews_label_01 = [review['reviewText'] for review in reviews_with_text if
                        review['sentiment'] in ["LABEL_0", "LABEL_1"]]
    reviews_label_23 = [review['reviewText'] for review in reviews_with_text if
                        review['sentiment'] in ["LABEL_2", "LABEL_3"]]

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

    description_features = []

    fields_to_check = ['description', 'generalDescriptionItem', 'descriptionItem', 'productDetails',
                       'generalProductDetails']

    for field in fields_to_check:
        if request_data['data'][0].get(field) and (isinstance(request_data['data'][0][field], str) and request_data['data'][0][field] != ""):
            description_features.append(get_vectorizer_and_features([request_data['data'][0][field]]))
        elif request_data['data'][0].get(field) and isinstance(request_data['data'][0][field], list):
            for detail_dict in request_data['data'][0][field]:
                for detail_value in detail_dict.values():
                    description_features.append(get_vectorizer_and_features([detail_value]))

    # Update the request data with the analyzed reviews
    request_data['totalreviews'] = analyzed_reviews
    request_data['data'][0]['sentiment'] = sentiment_results
    request_data['data'][0]['keyword'] = list(merged_feature_names)
    request_data['data'][0]['descriptionFeatures'] = sum(description_features, [])

    # Return the parameter as JSON response
    return jsonify({'param_from_nodejs': request_data}), 200


if __name__ == "__main__":
    app.run()
