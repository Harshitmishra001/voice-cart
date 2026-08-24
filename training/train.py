import json
import os
import sys
import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

def main():
    print(f'TensorFlow version: {tf.__version__}')
    print("Loading dataset...")
    
    dataset_path = os.path.join(os.path.dirname(__file__), 'dataset.json')
    if not os.path.exists(dataset_path):
        print(f"Error: Could not find {dataset_path}")
        sys.exit(1)
        
    with open(dataset_path, 'r', encoding='utf-8') as f:
        dataset = json.load(f)

    texts = [item['text'] for item in dataset]
    labels = [item['label'] for item in dataset]

    label_encoder = LabelEncoder()
    encoded_labels = label_encoder.fit_transform(labels)
    
    print("Loading MiniLM model and encoding phrases...")
    model = SentenceTransformer('paraphrase-multilingual-MiniLM-L12-v2')
    embeddings = model.encode(texts, show_progress_bar=True, batch_size=32)
    embeddings = np.array(embeddings)
    
    print("Training classifier...")
    X_train, X_test, y_train, y_test = train_test_split(
        embeddings, encoded_labels, test_size=0.15, random_state=42, stratify=encoded_labels
    )

    num_classes = len(label_encoder.classes_)
    y_train_onehot = keras.utils.to_categorical(y_train, num_classes)
    y_test_onehot = keras.utils.to_categorical(y_test, num_classes)

    classifier = keras.Sequential([
        layers.Input(shape=(384,)),
        layers.Dense(128, activation='relu'),
        layers.Dense(64, activation='relu'),
        layers.Dense(num_classes, activation='softmax')
    ])

    classifier.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001), loss='categorical_crossentropy', metrics=['accuracy'])
    classifier.fit(X_train, y_train_onehot, validation_data=(X_test, y_test_onehot), epochs=40, batch_size=32, verbose=1)

    # Export Raw Weights as JSON to completely bypass TensorFlow.js dependency hell
    weights = classifier.get_weights()
    export_data = {
        "w1": weights[0].tolist(),
        "b1": weights[1].tolist(),
        "w2": weights[2].tolist(),
        "b2": weights[3].tolist(),
        "w3": weights[4].tolist(),
        "b3": weights[5].tolist()
    }
    
    export_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'public', 'model')
    os.makedirs(export_dir, exist_ok=True)
    out_path = os.path.join(export_dir, 'weights.json')
    
    with open(out_path, 'w') as f:
        json.dump(export_data, f)
        
    print(f"Done! Raw weights successfully exported to {out_path}.")

if __name__ == '__main__':
    main()
