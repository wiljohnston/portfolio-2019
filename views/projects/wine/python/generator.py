from __future__ import absolute_import, division, print_function, unicode_literals

import sys
# print('sys.path')
# print(sys.path)
sys.path.insert(0, "/home/ec2-user/.local/lib/python3.7/site-packages") #point it to our packages since it cant see them for some reason

import tensorflow as tf

# tf.keras.backend.clear_session()  # For easy reset of notebook state.

from tensorflow import keras
from tensorflow.keras import layers


from tensorflow.keras.models import load_model

import numpy as np
import os
import time

import sys

name = sys.argv[1]

import os
cwd = os.getcwd()
model = load_model(cwd+'/views/projects/wine/python/wine-reviews_save_20epochs.h5')

def generate_text(model, start_string):
  char2idx = {'\n': 0, ' ': 1, '!': 2, '$': 3, '%': 4, '&': 5, "'": 6, '(': 7, ')': 8, '+': 9, ',': 10, '-': 11, '.': 12, '/': 13, '0': 14, '1': 15, '2': 16, '3': 17, '4': 18, '5': 19, '6': 20, '7': 21, '8': 22, '9': 23, ':': 24, ';': 25, '?': 26, 'A': 27, 'B': 28, 'C': 29, 'D': 30, 'E': 31, 'F': 32, 'G': 33, 'H': 34, 'I': 35, 'J': 36, 'K': 37, 'L': 38, 'M': 39, 'N': 40, 'O': 41, 'P': 42, 'Q': 43, 'R': 44, 'S': 45, 'T': 46, 'U': 47, 'V': 48, 'W': 49, 'X': 50, 'Y': 51, 'Z': 52, 'a': 53, 'b': 54, 'c': 55, 'd': 56, 'e': 57, 'f': 58, 'g': 59, 'h': 60, 'i': 61, 'j': 62, 'k': 63, 'l': 64, 'm': 65, 'n': 66, 'o': 67, 'p': 68, 'q': 69, 'r': 70, 's': 71, 't': 72, 'u': 73, 'v': 74, 'w': 75, 'x': 76, 'y': 77, 'z': 78, 'Ç': 79, 'É': 80, 'Ö': 81, 'à': 82, 'á': 83, 'â': 84, 'ã': 85, 'ä': 86, 'ç': 87, 'è': 88, 'é': 89, 'ê': 90, 'í': 91, 'î': 92, 'ñ': 93, 'ó': 94, 'ô': 95, 'ö': 96, 'û': 97, 'ü': 98, 'ÿ': 99, 'Ž': 100, '–': 101, '—': 102, '“': 103, '”': 104}
  vocab = ['\n', ' ', '!', '$', '%', '&', "'", '(', ')', '+', ',', '-', '.', '/', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';', '?', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'Ç', 'É', 'Ö', 'à', 'á', 'â', 'ã', 'ä', 'ç', 'è', 'é', 'ê', 'í', 'î', 'ñ', 'ó', 'ô', 'ö', 'û', 'ü', 'ÿ', 'Ž', '–', '—', '“', '”']
  idx2char = np.array(vocab)
  # Evaluation step (generating text using the learned model)

  # Number of characters to generate
  num_generate = 500

  # Converting our start string to numbers (vectorizing)
  input_eval = [char2idx[s] for s in start_string]
  input_eval = tf.expand_dims(input_eval, 0)

  # Empty string to store our results
  text_generated = []

  # Low temperatures results in more predictable text.
  # Higher temperatures results in more surprising text.
  # Experiment to find the best setting.
  temperature = 0.8

  # Here batch size == 1
  model.reset_states()
  for i in range(num_generate):
      predictions = model(input_eval)
      # remove the batch dimension
      predictions = tf.squeeze(predictions, 0)

      # using a categorical distribution to predict the word returned by the model
      predictions = predictions / temperature
      predicted_id = tf.random.categorical(predictions, num_samples=1)[-1,0].numpy()

      # We pass the predicted word as the next input to the model
      # along with the previous hidden state
      input_eval = tf.expand_dims([predicted_id], 0)

      text_generated.append(idx2char[predicted_id])

  return (start_string + ''.join(text_generated))

print(generate_text(model, start_string=u"" + name + " "))