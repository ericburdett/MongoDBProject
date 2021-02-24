# Multilingual Dictionary

This repository contains code to run a multilingual dictionary with Python, Flask and MongoDB.

## Dependencies

A conda environment file is provided that contains the necessary dependencies. This environment
can be created and activated with the following commands:

```
conda env create -f environment.yaml
conda activate mongodb_env
```

## Usage

After installing the necessary dependencies with Conda, you must start the Mongo Server and the Web
Server. This is done in two terminal windows with the following commands (Make sure your conda env is
activated):

```
# Start the Mongo Server
sh start_mongo.sh
```

```
# Start the Web Server
python server.py
```

Then, navigate to localhost (127.0.0.1) on port 5000 in the web browser of your choice!

```
http://127.0.0.1:5000/
```

## Other

You can also send commands directly to the mongo server using the Mongo CLI. This can be run using the
following command:

```
sh start_mongo_cli.sh
```
