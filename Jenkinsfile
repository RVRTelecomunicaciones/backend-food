pipeline {
  agent any

  tools {nodejs "node"}

  stages {

    stage('Git') {
      steps {
        git 'https://github.com/RVRTelecomunicaciones/backend-food.git'
      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        sh 'sudo pm2 start dist/main.js'
      }
    }
    stage('Deploy') {
      steps {
        sh 'sudo pm2 restart all'
      }
    }
    
  }
}
