pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20'
    }
    
    environment {
        APP_NAME = 'jenkins-demo-app'
        BUILD_NUMBER_ENV = "${BUILD_NUMBER}"
        // 🔥 KEY FIX: Use unique port per build
        APP_PORT = "${3000 + BUILD_NUMBER.toInteger()}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from GitHub...'
                checkout scm
                sh 'ls -la'
                sh 'pwd'
            }
        }
        
        stage('Pre-Cleanup') {
            steps {
                echo '🔥 Killing all node processes...'
                // 🔥 KEY FIX: Use 'pkill -9 node' not 'pkill -f node app.js'
                sh 'pkill -9 node || true'
                sh 'sleep 3'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
                echo 'Build completed successfully'
            }
        }
        
        stage('Test') {
            steps {
                echo "Running tests on port ${APP_PORT}..."
                script {
                    // 🔥 KEY FIX: Use APP_PORT environment variable
                    sh "PORT=${APP_PORT} nohup node app.js > app.log 2>&1 &"
                    sh 'sleep 5'
                    
                    // 🔥 KEY FIX: Pass PORT to npm test
                    sh "PORT=${APP_PORT} npm test"
                }
            }
            post {
                always {
                    echo 'Cleaning up...'
                    sh 'pkill -9 node || true'
                    sh 'sleep 2'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                sh 'mkdir -p /tmp/deployment'
                sh 'cp -r * /tmp/deployment/ || true'
                sh 'echo "Application deployed to /tmp/deployment"'
                sh 'ls -la /tmp/deployment'
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed!'
            sh 'echo "Build Number: ${BUILD_NUMBER_ENV}"'
            sh 'pkill -9 node || true'
        }
        success {
            echo 'Pipeline executed successfully! ✅'
        }
        failure {
            echo 'Pipeline execution failed! ❌'
        }
    }
}
