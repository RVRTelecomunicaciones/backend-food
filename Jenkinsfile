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
         sh 'pm2 restart all '
         sh 'pm2 start main.js'
      }
    }


    stage('Test') {
      steps {
        echo 'Testing..'
      }
    }
  }
}
