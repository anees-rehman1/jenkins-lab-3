pipeline {
    agent any
    
    // Modern: Pipeline-level options for better control
    options {
        // Keep only last 10 builds (disk management)
        buildDiscarder(logRotator(numToKeepStr: '10'))
        
        // Timeout entire pipeline after 30 minutes
        timeout(time: 30, unit: 'MINUTES')
        
        // Prevent concurrent builds of same job
        disableConcurrentBuilds()
        
        // Modern: Better console output
        timestamps()
        ansiColor('xterm')
    }
    
    // Modern: Environment variables with type safety
    environment {
        APP_NAME = 'jenkins-demo-modern'
        NODE_ENV = 'production'
        PORT = '3000'
    }
    
    // Modern: Parameters with better UX
    parameters {
        choice(
            name: 'DEPLOY_ENV',
            choices: ['development', 'staging', 'production'],
            description: '🎯 Select deployment environment'
        )
        booleanParam(
            name: 'RUN_LINT',
            defaultValue: true,
            description: '🔍 Run linting checks?'
        )
        booleanParam(
            name: 'SKIP_TESTS',
            defaultValue: false,
            description: '⏭️ Skip test execution?'
        )
    }
    
    stages {
        // Modern: Validation stage (best practice)
        stage('🔍 Validate') {
            steps {
                script {
                    echo "🔧 Validating environment..."
                    sh 'node --version'
                    sh 'npm --version'
                    sh 'git --version'
                }
            }
        }
        
        stage('📥 Checkout') {
            steps {
                // Modern: Clean workspace before checkout
                cleanWs()
                
                echo '📥 Checking out source code...'
                checkout scm
                
                script {
                    // Modern: Better directory listing
                    sh 'ls -lah'
                    sh 'pwd'
                    sh 'echo "Branch: ${env.BRANCH_NAME ?: 'unknown'}"'
                }
            }
        }
        
        stage('📦 Install Dependencies') {
            steps {
                echo '📦 Installing dependencies...'
                
                // Modern: Use npm ci for faster, reliable installs in CI
                sh 'npm ci'  // Better than npm install for CI
            }
        }
        
        stage('🔍 Lint') {
            when {
                expression { params.RUN_LINT }
            }
            steps {
                echo '🔍 Running linter...'
                sh 'npm run lint || echo "No linter configured, skipping"'
            }
        }
        
        stage('🏗️ Build') {
            steps {
                echo '🏗️ Building application...'
                sh 'echo "Build completed for ${APP_NAME}"'
                sh 'echo "Environment: ${params.DEPLOY_ENV}"'
            }
        }
        
        stage('🧪 Test') {
            when {
                not { params.SKIP_TESTS }
            }
            steps {
                echo '🧪 Running tests...'
                
                script {
                    // Modern: Better process management
                    sh '''
                        # Start app in background with proper logging
                        nohup npm start > app.log 2>&1 &
                        APP_PID=$!
                        
                        # Wait for app to be ready (modern approach)
                        for i in {1..30}; do
                            if curl -s http://localhost:3000 > /dev/null; then
                                echo "✅ App is ready!"
                                break
                            fi
                            echo "⏳ Waiting for app... ($i/30)"
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
                    // Modern: Archive test logs
                    archiveArtifacts artifacts: 'app.log', allowEmptyArchive: true
                }
            }
        }
        
        // Modern: Parallel deployment stages example
        stage('🚀 Deploy') {
            parallel {
                stage('Deploy to Staging') {
                    when {
                        expression { params.DEPLOY_ENV == 'staging' }
                    }
                    steps {
                        echo '🚀 Deploying to STAGING...'
                        sh '''
                            mkdir -p /tmp/staging-deployment
                            cp -r * /tmp/staging-deployment/
                            echo "✅ Staged at /tmp/staging-deployment"
                            ls -la /tmp/staging-deployment
                        '''
                    }
                }
                stage('Deploy to Production') {
                    when {
                        expression { params.DEPLOY_ENV == 'production' }
                    }
                    steps {
                        // Modern: Add approval for production
                        input message: '⚠️ Deploy to PRODUCTION?', ok: 'Yes, deploy'
                        
                        echo '🚀 Deploying to PRODUCTION...'
                        sh '''
                            mkdir -p /tmp/production-deployment
                            cp -r * /tmp/production-deployment/
                            echo "✅ Deployed to /tmp/production-deployment"
                        '''
                    }
                }
            }
        }
    }
    
    // Modern: Comprehensive post-build actions
    post {
        always {
            echo '📊 Pipeline execution completed!'
            
            // Modern: Clean workspace after build
            cleanWs(cleanWhenNotBuilt: false,
                    deleteDirs: true,
                    disableDeferredWipeout: true,
                    notFailBuild: true)
        }
        success {
            echo '✅ Pipeline executed successfully!'
            // Modern: Could add Slack/Teams notification here
        }
        failure {
            echo '❌ Pipeline execution failed!'
            // Modern: Could add alert here
        }
        unstable {
            echo '⚠️ Pipeline is unstable (tests failed but build succeeded)'
        }
        changed {
            echo '🔄 Pipeline status changed from previous run'
        }
    }
}
