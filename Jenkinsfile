pipeline {
  agent any

  stages {

    stage('Git') {
      steps {
        git 'https://github.com/RVRTelecomunicaciones/backend-food.git'
      }
    }

    stage('Build') {
      steps {
        sh 'npm install'
         sh '<<Build Command>>'
      }
    }


    stage('Test') {
      steps {
        sh 'node test'
      }
    }
  }
}
