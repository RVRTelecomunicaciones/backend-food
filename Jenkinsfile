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
         sh 'sudo pm2 restart all'
      }
    }


    stage('Test') {
      steps {
        echo 'Testing..'
      }
    }
  }
}
