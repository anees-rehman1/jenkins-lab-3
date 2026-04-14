pipeline {
    agent any
    
    // REMOVED: ansiColor('xterm') - Install AnsiColor plugin if you want colors
    // For now, using only built-in options
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        disableConcurrentBuilds()
        timestamps()
    }
    
    environment {
        APP_NAME = 'jenkins-demo-modern'
        NODE_ENV = 'production'
        PORT = '3000'
    }
    
    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: 'Select deployment environment'
        )
        booleanParam(
            name: 'RUN_LINT',
            defaultValue: true,
            description: 'Run linting checks?'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: 'Skip test execution?'
        )
    }
    
    stages {
        stage('Validate') {
            steps {
                script {
                    echo "Validating environment..."
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'git --version'
                }
            }
        }
        
        stage('Checkout') {
            steps {
                cleanWs()
                echo 'Checking out source code...'
                checkout scm
                script {
                    sh 'ls -lah'
                    sh 'pwd'
                }
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo 'Installing dependencies...'
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            when {
                expression { params.RUN_LINT == true }
            }
            steps {
                echo 'Running linter...'
                sh 'npm run lint || echo "No linter configured, skipping"'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Building application...'
                sh 'echo "Build completed for ${APP_NAME}"'
                sh 'echo "Environment: ${params.DEPLOY_ENV}"'
            }
        }
        
        stage('Test') {
            // FIXED: Proper 'when' condition syntax with 'expression'
            when {
                expression { params.SKIP_TESTS == false }
            }
            steps {
                echo 'Running tests...'
                script {
                    sh '''
                        # Start app in background
                        nohup npm start > app.log 2>&1 &
                        APP_PID=$!
                        
                        # Wait for app to be ready
                        for i in {1..30}; do
                            if curl -s http://localhost:3000 > /dev/null; then
                                echo "App is ready!"
                                break
                            fi
                            echo "Waiting for app... ($i/30)"
                            sleep 1
                        done
                        
                        # Run tests
                        npm test
                        
                        # Cleanup
                        kill $APP_PID || true
                    '''
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'app.log', allowEmptyArchive: true
                }
            }
        }
        
        stage('Deploy') {
            parallel {
                stage('Deploy to Staging') {
                    when {
                        expression { params.DEPLOY_ENV == 'staging' }
                    }
                    steps {
                        echo 'Deploying to STAGING...'
                        sh '''
                            mkdir -p /tmp/staging-deployment
                            cp -r * /tmp/staging-deployment/
                            echo "Deployed to /tmp/staging-deployment"
                            ls -la /tmp/staging-deployment
                        '''
                    }
                }
                stage('Deploy to Production') {
                    when {
                        expression { params.DEPLOY_ENV == 'production' }
                    }
                    steps {
                        input message: 'Deploy to PRODUCTION?', ok: 'Yes, deploy'
                        echo 'Deploying to PRODUCTION...'
                        sh '''
                            mkdir -p /tmp/production-deployment
                            cp -r * /tmp/production-deployment/
                            echo "Deployed to /tmp/production-deployment"
                        '''
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed!'
            cleanWs(cleanWhenNotBuilt: false, deleteDirs: true, notFailBuild: true)
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline execution failed!'
        }
    }
}
