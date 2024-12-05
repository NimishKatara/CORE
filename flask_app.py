from flask import Flask, request, jsonify
import pandas as pd
import torch
from transformers import AutoModelForSequenceClassification, AutoTokenizer
import re
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 


df = pd.read_csv('Hinglish_Profanity_List.csv', encoding='latin1')
cuss_words = df['abuses'].dropna().tolist()

# Load the tokenizer and model
model_name = "s-nlp/roberta_toxicity_classifier"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)


def normalize_repeated_characters(text):
    
    return re.sub(r'(.)\1{2,}', r'\1', text)


def classify_toxicity(text):
    
    normalized_text = normalize_repeated_characters(text.lower())
    
    for word in cuss_words:
        if re.search(r'\b' + re.escape(word) + r'\b', normalized_text):
            return True  
   
    inputs = tokenizer(normalized_text, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    scores = outputs.logits.softmax(dim=1).numpy()
    
 
    return scores[0][1] > scores[0][0] 


@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    message = data.get('message')
    is_abusive = classify_toxicity(message)
    return jsonify({'is_abusive': is_abusive})


if __name__ == '__main__':
    app.run(port=5000)
