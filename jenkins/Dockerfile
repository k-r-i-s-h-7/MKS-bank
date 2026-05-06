FROM jenkins/jenkins:lts

USER root

# Install dependencies, Docker, Maven, curl, and unzip (for sonar-scanner)
RUN apt-get update && \
    apt-get install -y curl maven docker.io unzip

# Install SonarScanner CLI
RUN curl -LO "https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-linux.zip" && \
    unzip sonar-scanner-cli-5.0.1.3006-linux.zip -d /opt && \
    ln -s /opt/sonar-scanner-5.0.1.3006-linux/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner-cli-5.0.1.3006-linux.zip

# Install kubectl
RUN curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && \
    chmod +x ./kubectl && \
    mv ./kubectl /usr/local/bin/kubectl

# Give Jenkins user access to Docker daemon (we'll mount the socket)
RUN groupadd -f docker && usermod -aG docker jenkins

USER jenkins
