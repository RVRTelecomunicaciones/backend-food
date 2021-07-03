pipeline {
  agent any

  tools {nodejs "node"}

  stages {

    stage('Git') {
      steps {
        git 'https://github.com/RVRTelecomunicaciones/backend-food.git'
        println(env.PATH)
      }
    }

    stage('Build') {
      steps {
        print "Environment will be : ${env.NODE_ENV}"
        sh 'npm install'
        sh 'npm run build'
      }
    }
    stage('Deploy') {
      steps {
        sh 'sudo pm2 stop 0'
        sh 'sudo pm2 start dist/main.js'
      }
    }
    
  }
}
