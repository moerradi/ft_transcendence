
echo "Starting test database..."


echo "Checking if docker is working..."
if [ ! "$(docker ps)" ]; then
	echo "Docker is not running. Please start docker and try again."
	exit 1
fi

echo "Checking if env file is present"
# create env file if not present
if [ ! -f ../.env ]; then
	touch ../.env
fi

echo "Checking if env file contains DATABASE_URL"
# checking if env file contains DATABASE_URL
if [ ! "$(grep DATABASE_URL ../.env)" ]; then
	echo "DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/db?schema=public" > ../.env
fi

echo "Checking if alpine-net network is present"
# create alpine net if not present
if [ ! "$(docker network ls | grep alpine-net)" ]; then
	docker network create alpine-net
fi

# check if db-data folder is present un /goinfre/$USER
if [ ! -d /goinfre/$USER/db-data ]; then
	mkdir /goinfre/$USER/db-data
fi

echo "Checking if db-data volume is present"
#create volume if not present
if [ ! "$(docker volume ls -q | grep db-data)" ]; then
    # check if $HELPER_DRIVE is set
	docker volume create db-data --driver local --opt type=none --opt device=/goinfre/$USER/db-data --opt o=bind
fi

echo "starting postgres container"
echo "if you encounter an error related to mounting the volume, please go the docker dashboard > settings > resources > file sharing and add /goinfre/$USER"
# start docker container if not already started
if [ ! "$(docker ps -a | grep postgres)" ]; then
	docker run -d -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=db --network alpine-net --name postgres -v db-data:/var/lib/postgresql/data postgres
fi