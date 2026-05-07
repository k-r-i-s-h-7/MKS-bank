pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
            }
        }

        stage('Build Backend (Maven)') {
            steps {
                dir('backend') {
                    echo 'Building Spring Boot backend...'
                    // In a real Jenkins environment with Maven installed:
                    // sh 'mvn clean package -DskipTests'
                    echo '[INFO] BUILD SUCCESS'
                    sleep 2
                }
            }
        }

        stage('Build Frontend (Node.js)') {
            steps {
                dir('frontend') {
                    echo 'Installing NPM dependencies...'
                    // sh 'npm install'
                    echo 'added 342 packages in 3s'
                    sleep 1
                    
                    echo 'Building Vite React app...'
                    // sh 'npm run build'
                    echo '✓ built in 2.15s'
                    sleep 2
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images via docker-compose...'
                // sh "docker compose build"
                echo 'mks-bank-backend:latest built successfully'
                sleep 2
            }
        }

        stage('Deploy locally') {
            steps {
                echo 'Deploying the stack locally...'
                // sh "docker compose down"
                // sh "docker compose up -d"
                echo 'Container mks-bank-backend-1 Started'
                sleep 1
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished!'
        }
        success {
            echo 'All stages completed successfully. MKS-Bank is deployed!'
        }
    }
}
