pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS-20'
    }
    
    environment {
        APP_NAME = 'jenkins-demo-app'
        BUILD_NUMBER_ENV = "${BUILD_NUMBER}"
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
        
        stage('Build') {
            steps {
                echo 'Building the application...'
                sh 'npm install'
                sh 'echo "Build completed successfully"'
            }
        }
        
        stage('Test') {
            steps {
                echo 'Running tests...'
                script {
                    // Start the application in background
                    sh 'nohup npm start > app.log 2>&1 &'
                    sh 'sleep 5'  // Wait for app to start
                    
                    // Run tests
                    sh 'npm test'
                    
                    // Stop the application
                    sh 'pkill -f "node app.js" || true'
                }
            }
            post {
                always {
                    echo 'Cleaning up test processes...'
                    sh 'pkill -f "node app.js" || true'
                }
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying application...'
                script {
                    // Create deployment directory
                    sh 'mkdir -p /tmp/deployment'
                    
                    // Copy application files
                    sh 'cp -r * /tmp/deployment/ || true'
                    
                    // Simulate deployment
                    sh 'echo "Application deployed to /tmp/deployment"'
                    sh 'ls -la /tmp/deployment'
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed!'
            sh 'echo "Build Number: ${BUILD_NUMBER_ENV}"'
        }
        success {
            echo 'Pipeline executed successfully! ✅'
        }
        failure {
            echo 'Pipeline execution failed! ❌'
        }
    }
}
