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
         sh 'npm run start:dev'
      }
    }


    stage('Test') {
      steps {
        sh 'node test'
      }
    }
  }
}
