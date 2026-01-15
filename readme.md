# 🌾 Agri 4.0 – AI Powered Crop Health Monitoring and Pest Detection System

![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.19-orange?logo=tensorflow)
![PyTorch](https://img.shields.io/badge/PyTorch-2.9-red?logo=pytorch)
![React](https://img.shields.io/badge/Frontend-React.js-blue?logo=react)
![Flask](https://img.shields.io/badge/Backend-Flask-green?logo=flask)
![License](https://img.shields.io/badge/License-MIT-green)

> 🌱 *An AI-driven precision agriculture platform that detects crop diseases, monitors soil health, and predicts pest risks using multispectral and hyperspectral imagery analysis.*

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Models & Datasets](#-models--datasets)
- [Screenshots](#-screenshots)
- [Google Drive Resources](#-google-drive-resources)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🧭 Overview

**Agri 4.0** is a comprehensive AI-powered agricultural monitoring system that combines:
- **Computer Vision** for crop health analysis
- **Deep Learning** models for pest detection
- **Remote Sensing** for multispectral/hyperspectral image processing
- **Web Dashboard** for real-time insights and decision support

The system analyzes aerial images from drones or satellites to detect pest infestations, monitor crop health, and provide actionable recommendations to farmers through an intuitive web interface.

---

## ✨ Features

### 🤖 AI-Powered Detection
- **Crop Health Analysis**: Real-time crop disease detection using CNN models
- **Pest Detection**: YOLOv8-based pest identification with confidence scores
- **Multispectral Analysis**: Sentinel-2 satellite imagery processing
- **Hyperspectral Processing**: Advanced spectral analysis for detailed crop monitoring

### 🌐 Web Dashboard
- **User Authentication**: Secure login/signup system
- **Real-time Predictions**: Upload images and get instant AI predictions
- **Community Forum**: Share insights and connect with other farmers
- **Marketplace**: Buy/sell agricultural products
- **Cultivation Tips**: AI-powered agricultural guidance
- **Chat Assistant**: AI consultation for farming queries
- **Calculators**: Various agricultural calculators

### 📊 Data Management
- MongoDB database for user data and community posts
- Efficient image processing pipeline
- Model inference optimization

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React.js)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │Dashboard │ │  Crop    │ │   Pest   │ │Community │     │
│  │          │ │  Health  │ │Detection │ │  Forum   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API
┌───────────────────────┴─────────────────────────────────────┐
│              Backend API (Flask)                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │  Crop    │ │   Pest   │ │MultiSpec │ │  Auth    │     │
│  │  Route   │ │  Route   │ │  Route   │ │  Route   │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────┴────┐  ┌───────┴────┐  ┌───────┴────┐
│   Models   │  │  Database  │  │ Inference  │
│            │  │  (MongoDB) │  │  Engine    │
│ • Crop.h5  │  │            │  │            │
│ • Pest.pt  │  │            │  │ • OpenCV   │
│ • Multi.h5 │  │            │  │ • TensorFlow│
└────────────┘  └────────────┘  └────────────┘
```

---

## 🛠️ Technology Stack

### Backend
- **Python 3.10+**
- **Flask**: Web framework
- **TensorFlow/Keras**: Deep learning for crop health
- **PyTorch/Ultralytics**: YOLOv8 for pest detection
- **OpenCV**: Image processing
- **MongoDB**: Database
- **LangChain/Groq**: AI chat assistant

### Frontend
- **React.js 18**: UI framework
- **React Router**: Navigation
- **Axios**: HTTP client
- **Tailwind CSS**: Styling
- **Vite**: Build tool

### AI/ML
- **TensorFlow 2.19**: Crop health models
- **PyTorch 2.9**: Pest detection models
- **YOLOv8**: Object detection
- **ResNet50**: Feature extraction
- **Sentinel-2**: Satellite imagery processing

---

## 📦 Installation

### Prerequisites
- Python 3.10 or higher
- Node.js 16+ and npm
- MongoDB (local or cloud instance)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agri-4.0.git
   cd agri-4.0
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/agri4
   SECRET_KEY=your-secret-key-here
   GROQ_API_KEY=your-groq-api-key
   GEMINI_API_KEY=your-gemini-api-key
   ```

5. **Download Models** (See [Google Drive Resources](https://drive.google.com/drive/u/1/folders/1fU4gaFoclK6vXGxmEAG2PFLCLVoYt28X))
   - Place model files in `backend/models/`:
     - `crop_model.h5`
     - `pest_model.pt`
     - `multispectral_model.h5`
     - `resnet50_0.497.pkl`
     - `classes.txt`

### Frontend Setup

1. **Navigate to web directory**
   ```bash
   cd web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at `http://localhost:5173`

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   python app.py
   ```
   Backend API will be available at `http://localhost:5000`

3. **Start Frontend** (in a new terminal)
   ```bash
   cd web
   npm run dev
   ```

4. **Access the application**
   - Open browser: `http://localhost:5173`

---

## 📁 Project Structure

```
Agri-4.0/
├── backend/
│   ├── app.py                 # Flask application entry point
│   ├── database.py            # MongoDB connection
│   ├── models/                # AI model files (download from Drive)
│   │   ├── crop_model.h5
│   │   ├── pest_model.pt
│   │   ├── multispectral_model.h5
│   │   └── classes.txt
│   ├── inference/             # Model inference modules
│   │   ├── crop_model.py
│   │   ├── pest_model.py
│   │   └── multispectral_model.py
│   ├── routes/                # API routes
│   │   ├── crop.py
│   │   ├── pest.py
│   │   ├── multispectral.py
│   │   ├── auth.py
│   │   ├── community.py
│   │   ├── market.py
│   │   ├── chat.py
│   │   └── tips.py
│   └── requirements.txt       # Python dependencies
│
├── web/                       # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   └── context/           # React context
│   ├── package.json
│   └── vite.config.js
│
├── notebooks/                 # Jupyter notebooks
│   ├── hyperspectral.ipynb
│   ├── train_crop_keras.ipynb
│   └── train_resnet_pest.ipynb
│
├── scripts/                   # Utility scripts
│   ├── seed_market.py
│   ├── seed_community.py
│   └── test_*.py
│
├── datasets/                  # Training datasets (download from Drive)
│   ├── crop/
│   └── pest/
│
├── .gitignore                 # Git ignore rules
├── README.md                  # This file
└── GOOGLE_DRIVE_GUIDE.md      # Google Drive upload guide
```

---

## 🚀 Usage

### Crop Health Detection

1. Navigate to **Crop Health** page
2. Upload a crop image (JPG/PNG)
3. Click **Analyze**
4. View results:
   - Disease classification
   - Confidence score
   - Health recommendations

### Pest Detection

1. Navigate to **Pest Detection** page
2. Upload an image containing pests
3. Get instant detection results:
   - Pest type identification
   - Bounding boxes (if applicable)
   - Confidence scores
   - Treatment suggestions

### Multispectral Analysis

1. Upload Sentinel-2 satellite imagery (.SAFE format)
2. System processes multispectral bands
3. Generate NDVI maps and health indices
4. Visualize crop health patterns

### Community Forum

- Post questions and share experiences
- Connect with other farmers
- Get community support

### AI Chat Assistant

- Ask farming-related questions
- Get AI-powered recommendations
- Receive cultivation tips

---

## 📡 API Documentation

### Endpoints

#### Crop Health Prediction
```http
POST /api/predict/crop
Content-Type: multipart/form-data

Body:
  file: <image_file>
```

**Response:**
```json
{
  "prediction": "Healthy",
  "confidence": 0.95,
  "diseases": [],
  "recommendations": ["Continue current practices"]
}
```

#### Pest Detection
```http
POST /api/predict/pest
Content-Type: multipart/form-data

Body:
  file: <image_file>
```

**Response:**
```json
{
  "label": "Aphids",
  "confidence": 0.87,
  "probabilities": {...}
}
```

#### Multispectral Analysis
```http
POST /api/predict/multispectral
Content-Type: multipart/form-data

Body:
  file: <satellite_image>
```

#### Authentication
```http
POST /api/auth/register
POST /api/auth/login
```

#### Community
```http
GET /api/community/posts
POST /api/community/posts
```

---

## 🤖 Models & Datasets

### Models Included

1. **Crop Health Model** (`crop_model.h5`)
   - Architecture: Custom CNN
   - Purpose: Crop disease classification
   - Accuracy: ~95%

2. **Pest Detection Model** (`pest_model.pt`)
   - Architecture: YOLOv8
   - Purpose: Pest identification
   - Classes: Multiple pest types

3. **Multispectral Model** (`multispectral_model.h5`)
   - Purpose: Satellite imagery analysis
   - Features: NDVI, health indices

### Dataset Information

- **Crop Dataset**: 40,000+ images across multiple crop types
- **Pest Dataset**: Annotated pest images
- **Satellite Data**: Sentinel-2 Level-2A products

> **Note**: Large model files and datasets are hosted on Google Drive. See [Google Drive Resources]([#-google-drive-resources](https://drive.google.com/drive/u/1/folders/1fU4gaFoclK6vXGxmEAG2PFLCLVoYt28X)) section.

---

## 📸 Screenshots

### Dashboard Overview
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)
*Main dashboard showing crop health overview and quick actions*

### Crop Health Analysis
![Crop Health](https://via.placeholder.com/800x400?text=Crop+Health+Analysis)
*Real-time crop disease detection interface*

### Pest Detection
![Pest Detection](https://via.placeholder.com/800x400?text=Pest+Detection)
*AI-powered pest identification with confidence scores*

### Multispectral Analysis
![Multispectral](https://via.placeholder.com/800x400?text=Multispectral+Analysis)
*Satellite imagery processing and NDVI visualization*

### Community Forum
![Community](https://via.placeholder.com/800x400?text=Community+Forum)
*Community platform for farmers to connect and share*

### AI Chat Assistant
![Chat Assistant](https://via.placeholder.com/800x400?text=AI+Chat+Assistant)
*AI-powered consultation and farming guidance*

> **Note**: Replace placeholder images with actual screenshots of your application. Upload screenshots to Google Drive and update the links above.

---

## 📦 Google Drive Resources

### Large Files & Models

Due to GitHub's file size limitations, the following resources are hosted on Google Drive:

#### 🔗 [Download Models & Datasets](https://drive.google.com/drive/folders/YOUR_FOLDER_ID)

**Required Files:**

1. **Model Files** (`backend/models/`)
   - [ ] `crop_model.h5` (~50 MB)
   - [ ] `pest_model.pt` (~100 MB)
   - [ ] `multispectral_model.h5` (~80 MB)
   - [ ] `resnet50_0.497.pkl` (~50 MB)
   - [ ] `classes.txt` (~1 KB)

2. **Datasets** (`datasets/`)
   - [ ] Crop Dataset (~5 GB)
   - [ ] Pest Dataset (~500 MB)
   - [ ] Satellite Imagery (~2 GB)

3. **Screenshots** (for README)
   - [ ] Dashboard screenshot
   - [ ] Crop Health screenshot
   - [ ] Pest Detection screenshot
   - [ ] Multispectral Analysis screenshot
   - [ ] Community Forum screenshot
   - [ ] AI Chat Assistant screenshot

### How to Download

1. **Access Google Drive Link**: [Click here](https://drive.google.com/drive/folders/YOUR_FOLDER_ID)
2. **Download Models**: Extract to `backend/models/` directory
3. **Download Datasets**: Extract to `datasets/` directory
4. **Verify File Structure**: Ensure all files are in correct locations

### Uploading Your Own Files to Google Drive

See [GOOGLE_DRIVE_GUIDE.md](./GOOGLE_DRIVE_GUIDE.md) for detailed instructions on uploading large files to Google Drive.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Authors

- **Your Name** - *Initial work* - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- TensorFlow and PyTorch communities
- Sentinel-2 satellite data providers
- OpenCV contributors
- React.js community
- All contributors and testers

---

## 📧 Contact

For questions or support:
- **Email**: your.email@example.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/agri-4.0/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agri-4.0/discussions)

---

## 🔗 Useful Links

- [Project Documentation](./docs/)
- [API Reference](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Google Drive Guide](./GOOGLE_DRIVE_GUIDE.md)

---

**⭐ If you find this project helpful, please give it a star!**
