# How to run back end:

## Docker
Install docker, always use sudo command on your codes.
	https://docs.docker.com/engine/install/ubuntu/
	
Download postgresql image on docker
	sudo docker pull postgres
	
Create a container with this image
	sudo docker run --name USERNAME -e POSTGRES_PASSWORD=PASSWORD -p 5432:5432 -d postgres
	exemple: sudo docker run --name postgres -e POSTGRES_PASSWORD=password123 -p 5432:5432 -d postgres
	
If you need listen postgresql port: 
	sudo ss -lptn 'sport = :5432'

remove postgresql installed:
	sudo apt-get --purge remove postgresql postgresql-*
	
To start running container docker:
	sudo docker start CONTAINER_NAME
	
	exemple: sudo docker start postgres


## PGAdmin or other SGBD	
Install pgAdmin

	reference: https://www.tecmint.com/install-postgresql-and-pgadmin-in-ubuntu/
	
	curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
	sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list && apt update'

	sudo apt install pgadmin4
	
Create a server on pgAdmin called localhost on port: 5432 and address: 127.0.0.1
Create a dabase on this server called: "wob_db"

## Project
Clone repository on github. 

Put this code on terminal to download project dependencies: 
	yarn
	
create a file called .env and write on it enviorement variables

exemple:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=wob_db
DB_USERNAME=postgres
DB_PASSWORD=password123
