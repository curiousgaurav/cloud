import os
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import sys
from datetime import datetime
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.datasets import load_iris

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Application configuration
app.config['JSON_SORT_KEYS'] = False
MODEL_NAME = os.getenv('MODEL_NAME', 'curiousgaurav-ml-service')
VERSION = os.getenv('VERSION', '1.0')
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')

# ============= Model Training =============

def train_iris_model():
    """Train Iris classification model"""
    try:
        logger.info("Training Iris classification model...")
        iris = load_iris()
        X = iris.data
        y = iris.target
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X, y)
        
        logger.info("Model training completed successfully")
        return model, iris
    except Exception as e:
        logger.error(f"Model training failed: {str(e)}")
        raise

# Initialize model at startup
try:
    MODEL, IRIS_DATA = train_iris_model()
    IRIS_TARGET_NAMES = IRIS_DATA.target_names
    IRIS_FEATURE_NAMES = IRIS_DATA.feature_names
    MODEL_LOADED = True
    logger.info(f"Model loaded successfully. Target classes: {IRIS_TARGET_NAMES}")
except Exception as e:
    logger.error(f"Failed to load model: {str(e)}")
    MODEL_LOADED = False
    MODEL = None

# ============= Health & Info Endpoints =============

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    status = 'healthy' if MODEL_LOADED else 'unhealthy'
    return jsonify({
        'status': status,
        'model_loaded': MODEL_LOADED,
        'service': MODEL_NAME,
        'version': VERSION,
        'timestamp': datetime.utcnow().isoformat()
    }), 200 if MODEL_LOADED else 503

@app.route('/', methods=['GET'])
def home():
    """Welcome endpoint"""
    return jsonify({
        'message': f'Welcome to {MODEL_NAME}',
        'description': 'ML-as-a-Service for Iris Flower Classification',
        'version': VERSION,
        'environment': ENVIRONMENT,
        'status': 'ready' if MODEL_LOADED else 'not ready',
        'endpoints': {
            'GET /': 'This welcome message',
            'GET /health': 'Health check',
            'GET /api/info': 'Service information',
            'GET /api/features': 'Get feature names',
            'GET /api/classes': 'Get class names',
            'POST /api/predict': 'Make prediction',
            'POST /api/predict-batch': 'Batch predictions',
            'GET /metrics': 'Service metrics'
        }
    }), 200

@app.route('/api/info', methods=['GET'])
def api_info():
    """Service information endpoint"""
    return jsonify({
        'service_name': MODEL_NAME,
        'version': VERSION,
        'environment': ENVIRONMENT,
        'ml_model': 'Random Forest Classifier',
        'dataset': 'Iris Flower Dataset',
        'model_status': 'loaded' if MODEL_LOADED else 'not loaded',
        'timestamp': datetime.utcnow().isoformat()
    }), 200

# ============= Model Information Endpoints =============

@app.route('/api/features', methods=['GET'])
def get_features():
    """Get feature names"""
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded'}), 503
    
    return jsonify({
        'features': IRIS_FEATURE_NAMES.tolist(),
        'count': len(IRIS_FEATURE_NAMES),
        'description': 'Iris flower features for model input'
    }), 200

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Get classification classes"""
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded'}), 503
    
    return jsonify({
        'classes': IRIS_TARGET_NAMES.tolist(),
        'count': len(IRIS_TARGET_NAMES),
        'class_mapping': {i: name for i, name in enumerate(IRIS_TARGET_NAMES)}
    }), 200

# ============= Prediction Endpoints =============

@app.route('/api/predict', methods=['POST'])
def predict():
    """Make single prediction"""
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded'}), 503
    
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'features' not in data:
            return jsonify({
                'error': 'Invalid input',
                'required_fields': ['features'],
                'example': {
                    'features': [5.1, 3.5, 1.4, 0.2]
                }
            }), 400
        
        features = np.array(data['features']).reshape(1, -1)
        
        # Validate feature count
        if features.shape[1] != 4:
            return jsonify({
                'error': f'Expected 4 features, got {features.shape[1]}',
                'feature_names': IRIS_FEATURE_NAMES.tolist()
            }), 400
        
        # Make prediction
        prediction = MODEL.predict(features)[0]
        probabilities = MODEL.predict_proba(features)[0]
        
        return jsonify({
            'prediction': {
                'class_id': int(prediction),
                'class_name': IRIS_TARGET_NAMES[prediction],
                'confidence': float(probabilities[prediction])
            },
            'probabilities': {
                IRIS_TARGET_NAMES[i]: float(prob) 
                for i, prob in enumerate(probabilities)
            },
            'input_features': data['features'],
            'feature_names': IRIS_FEATURE_NAMES.tolist(),
            'timestamp': datetime.utcnow().isoformat(),
            'model_version': VERSION
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Value error: {str(e)}'}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

@app.route('/api/predict-batch', methods=['POST'])
def predict_batch():
    """Batch predictions"""
    if not MODEL_LOADED:
        return jsonify({'error': 'Model not loaded'}), 503
    
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'samples' not in data:
            return jsonify({
                'error': 'Invalid input',
                'required_fields': ['samples'],
                'example': {
                    'samples': [[5.1, 3.5, 1.4, 0.2], [7.0, 3.2, 4.7, 1.4]]
                }
            }), 400
        
        samples = np.array(data['samples'])
        
        # Validate feature count
        if samples.shape[1] != 4:
            return jsonify({'error': f'Expected 4 features per sample'}), 400
        
        # Make predictions
        predictions = MODEL.predict(samples)
        probabilities = MODEL.predict_proba(samples)
        
        results = []
        for i, (pred, probs) in enumerate(zip(predictions, probabilities)):
            results.append({
                'sample_index': i,
                'input': data['samples'][i],
                'prediction': {
                    'class_id': int(pred),
                    'class_name': IRIS_TARGET_NAMES[pred],
                    'confidence': float(probs[pred])
                },
                'probabilities': {
                    IRIS_TARGET_NAMES[j]: float(p) 
                    for j, p in enumerate(probs)
                }
            })
        
        return jsonify({
            'predictions': results,
            'total_samples': len(samples),
            'timestamp': datetime.utcnow().isoformat(),
            'model_version': VERSION
        }), 200
        
    except Exception as e:
        logger.error(f"Batch prediction error: {str(e)}")
        return jsonify({'error': f'Batch prediction failed: {str(e)}'}), 500

# ============= Metrics Endpoint =============

@app.route('/metrics', methods=['GET'])
def metrics():
    """Service metrics"""
    return jsonify({
        'service': MODEL_NAME,
        'version': VERSION,
        'model_status': 'loaded' if MODEL_LOADED else 'not_loaded',
        'model_type': 'RandomForestClassifier',
        'features': {
            'count': 4,
            'names': IRIS_FEATURE_NAMES.tolist()
        },
        'classes': {
            'count': 3,
            'names': IRIS_TARGET_NAMES.tolist()
        },
        'timestamp': datetime.utcnow().isoformat(),
        'uptime': 'running'
    }), 200

# ============= Error Handlers =============

@app.route('/api/predict', methods=['GET'])
def predict_get_error():
    """Redirect GET /predict to POST"""
    return jsonify({
        'error': 'Use POST method for predictions',
        'example_curl': "curl -X POST http://localhost:5000/api/predict -H 'Content-Type: application/json' -d '{\"features\": [5.1, 3.5, 1.4, 0.2]}'"
    }), 405

@app.errorhandler(404)
def not_found(error):
    """404 error handler"""
    return jsonify({
        'error': 'Endpoint not found',
        'available_endpoints': {
            'GET /': 'Welcome',
            'GET /health': 'Health check',
            'GET /api/info': 'Service info',
            'GET /api/features': 'Model features',
            'GET /api/classes': 'Classification classes',
            'POST /api/predict': 'Single prediction',
            'POST /api/predict-batch': 'Batch prediction',
            'GET /metrics': 'Metrics'
        }
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """500 error handler"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500

# ============= Entry Point =============

if __name__ == '__main__':
    logger.info(f"Starting {MODEL_NAME} (v{VERSION})")
    logger.info(f"Environment: {ENVIRONMENT}")
    
    if not MODEL_LOADED:
        logger.warning("WARNING: Model not loaded. Service is in limited mode")
    
    port = int(os.getenv('PORT', 5000))
    host = os.getenv('HOST', '0.0.0.0')
    
    logger.info(f"Listening on {host}:{port}")
    app.run(host=host, port=port, debug=(ENVIRONMENT == 'development'))
