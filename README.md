# UdhyanSetu

## How to Run This Project:

### Clone this Repository:

```sh
git clone https://github.com/kaymen99/Healthcare-AI-WebApp.git
cd Healthcare-AI-WebApp
```

### Using Python Directly:

#### Install Requirements (using a virtual environment is preferable):

```sh
pip install -r requirements.txt
```

#### Run this Command to Start the Local Server:

```sh
python app.py
```

### Using Docker:

Build the Docker image (make sure to install Docker Desktop: [Docker Desktop](https://www.docker.com/products/docker-desktop/)):

```sh
docker build -t healthcare-ai-webapp .
```

Run the Docker container:

```sh
docker run -p 5000:5000 healthcare-ai-webapp
```

You should be able to access your app by visiting [http://localhost:5000/](http://localhost:5000/) in your browser.
