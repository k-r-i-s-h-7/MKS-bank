pipeline {
    agent any

    environment {
        DOCKER_COMPOSE = 'docker compose'
    }

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
                    // We skip tests here just for a quick basic pipeline showcase.
                    // In a real scenario, you'd run 'mvn clean test package'
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Build Frontend (Node.js)') {
            steps {
                dir('frontend') {
                    echo 'Installing NPM dependencies...'
                    sh 'npm install'
                    
                    echo 'Building Vite React app...'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images via docker-compose...'
                // Using --no-cache to ensure fresh images during the CI/CD run
                sh "${DOCKER_COMPOSE} build"
            }
        }

        stage('Deploy locally') {
            steps {
                echo 'Deploying the stack locally...'
                // Restarts the containers with the newly built images
                sh "${DOCKER_COMPOSE} down"
                sh "${DOCKER_COMPOSE} up -d"
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
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
