pipeline {
    agent any

    environment {
        // We will build and tag images locally for now
        DOCKER_REGISTRY = 'mks-bank'
        BACKEND_IMAGE = "${DOCKER_REGISTRY}/backend"
        FRONTEND_IMAGE = "${DOCKER_REGISTRY}/frontend"
        // Use build number for tagging
        TAG = "${env.BUILD_ID}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                echo "Checked out source code."
            }
        }

        stage('Test & Build Backend') {
            steps {
                dir('backend') {
                    // Compile the code so SonarQube can analyze the .class files
                    sh 'chmod +x ./mvnw'
                    sh './mvnw clean compile -DskipTests'
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                dir('backend') {
                    // Run Sonar Scanner to analyze the code
                    // mks_sonarqube is the container name in our docker-compose network
                    sh 'sonar-scanner -Dsonar.host.url=http://mks_sonarqube:9000'
                    echo "SonarQube analysis completed. Check http://localhost:9000"
                }
            }
        }

        stage('Package Backend') {
            steps {
                dir('backend') {
                    // Now package it into a JAR
                    sh './mvnw package -DskipTests'
                    echo "Backend packaged successfully."
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    // We build the frontend using Docker's multi-stage build later, 
                    // or we can build it here if node is installed.
                    // For simplicity, we'll let the Dockerfile handle the npm build.
                    echo "Frontend will be built inside its Docker container."
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "Building Backend Docker Image..."
                sh "docker build -t ${BACKEND_IMAGE}:latest -t ${BACKEND_IMAGE}:${TAG} -f backend/Dockerfile backend/"
                
                echo "Building Frontend Docker Image..."
                sh "docker build -t ${FRONTEND_IMAGE}:latest -t ${FRONTEND_IMAGE}:${TAG} -f frontend/Dockerfile frontend/"
            }
        }

        /* 
        // Uncomment this when you configure a Docker Hub credential in Jenkins
        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                    sh "echo \$DOCKER_PASS | docker login -u \$DOCKER_USER --password-stdin"
                    sh "docker push ${BACKEND_IMAGE}:${TAG}"
                    sh "docker push ${BACKEND_IMAGE}:latest"
                    sh "docker push ${FRONTEND_IMAGE}:${TAG}"
                    sh "docker push ${FRONTEND_IMAGE}:latest"
                }
            }
        }
        */

        stage('Deploy to Kubernetes') {
            steps {
                // To do this, Jenkins needs `kubectl` and a valid kubeconfig.
                // We update the deployment images to the new tag.
                echo "Deploying to Kubernetes..."
                sh "kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${TAG} -n mks-bank"
                sh "kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${TAG} -n mks-bank"
                
                // Wait for rollout
                sh "kubectl rollout status deployment/backend -n mks-bank --timeout=120s"
                sh "kubectl rollout status deployment/frontend -n mks-bank --timeout=120s"
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs."
        }
    }
}
