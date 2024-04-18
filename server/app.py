from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import os
from flask_cors import CORS
from flask import request

# from ..local.getPhoneticLocally import load_pronouncing_dictionary, get_pronunciation
import sys  
sys.path.append('/Users/fabianbussard/Documents/Python/new-word-web')
from server.getPhoneticLocally import load_pronouncing_dictionary, get_pronunciation
from pymongo import MongoClient
from datetime import datetime, date, time, timedelta, timezone

app = Flask(__name__)

# Get the path to the templates directory relative to the current file
template_dir = os.path.join(os.path.dirname(__file__), '..', 'my-react-app', 'templates')

CORS(app)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['word_database']
collection = db['words']

# Load CMU dictionary
dictionary_path = '/Users/fabianbussard/Documents/Python/new-word-web/server/data/cmudict-0.7b.txt'
cmu_dict = load_pronouncing_dictionary(dictionary_path)

# Initialize variables for date range
# start_of_day = datetime.combine(datetime.now().date(), datetime.min.time())
# end_of_day = datetime.combine(datetime.now().date() + timedelta(days=1), datetime.min.time())

@app.route('/test_get_words', methods=['POST'])
def get_words():
    selected_date_str = request.json.get('selectedDate')
    print(selected_date_str) 

    # Convert the selected date string to a datetime object
    selected_date = datetime.strptime(selected_date_str, '%Y-%m-%d')

    # Set the start and end of the selected day
    start_of_day = selected_date.replace(hour=0, minute=0, second=0, microsecond=0)
    end_of_day = start_of_day.replace(hour=23, minute=59, second=59, microsecond=999999)

    # Query the collection for words within the selected day
    words = collection.find({
        'date': {
            '$gte': start_of_day,
            '$lte': end_of_day
        }
    })

    # Convert the cursor to a list of dictionaries
    words_list = list(words)

    # Extract only the 'word', 'definition', and 'phonetic' fields from each dictionary
    words_list_filtered = []
    for word in words_list:
        word_filtered = {
            'word': word['word'],
            'definition': word['definition'],
            'phonetic': word['phonetic']
        }
        words_list_filtered.append(word_filtered)

    # Return the filtered data in JSON format
    return jsonify(words_list_filtered)




# Endpoint for fetching word dates
@app.route('/word-dates', methods=['GET'])
def get_word_dates():
    try:
        # Query the database to get the dates when words were added
        word_dates = collection.find({}, {'_id': 0, 'date': 1})
        
        # Extract the date part from the 'date' field if it exists
        formatted_dates = []
        for word in word_dates:
            # Assuming 'date' is already in datetime format
            formatted_dates.append(word['date'].date().isoformat())

        # Send the formatted dates as the response
        return jsonify({'wordDates': formatted_dates}), 200
    except Exception as e:
        print('Error fetching word dates:', e)
        return jsonify({'error': 'Failed to fetch word dates'})





@app.route('/AddWordForm', methods=['GET', 'POST'])
def add_word():
    phonetic = None
    global start_of_day, end_of_day

    if request.method == 'POST':
        data = request.get_json()
        word = data.get('word')
        definition = data.get('definition')

        # Get the phonetic version from the CMU dictionary
        pronunciation = get_pronunciation(word, cmu_dict)
        phonetic = pronunciation if pronunciation != 'Not found' else None

        # Get the date of the day the word was added
        date_time = datetime.now()
        date = date_time.date()
        today_date = datetime.combine(date, time.min)
        # Calculate the start and end of the current day
        # start_of_day = datetime.combine(date, datetime.min.time())
        # end_of_day = datetime.combine(date + timedelta(days=1), datetime.min.time())

        # Insert data into MongoDB
        db.words.insert_one({'word': word, 'definition': definition, 'phonetic': phonetic, 'date': today_date, 'used': False})

        return jsonify(data)

        # Redirect to the result page with the input data
        # return redirect(url_for('result', word=word, word_def=definition, phonetic=phonetic))

    # return render_template('AddWordForm.html')


def update_word_status(word_id, status):
    # Update the status of the word with the given word_id
    try:
        # Update the document with the given word_id
        collection.update_one(
            {"_id": word_id},
            {"$set": {"used": status}}
        )
        return True  # Indicates success
    except Exception as e:
        print("An error occurred:", e)
        return False  # Indicates failure


if __name__ == '__main__':
    app.run(debug=True)


