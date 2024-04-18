# getPhoneticLocally.py
import os

def load_pronouncing_dictionary(file_path):
    pronouncing_dict = {}
    with open(file_path, 'r', encoding='ISO-8859-1') as file:
        for line in file:
            parts = line.strip().split()
            word = parts[0].lower()
            pronunciation = " ".join(parts[1:])
            pronouncing_dict[word] = pronunciation
    return pronouncing_dict

def get_pronunciation(word, cmu_dict):
    return cmu_dict.get(word.lower(), "Not found")
