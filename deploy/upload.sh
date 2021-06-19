if [ -z $1 ]
then
  echo "need a server name!"
  exit
fi

if test -f service.tar.gz; then
  rm service.tar.gz
fi

tar --exclude='../newrelic_agent.log' --exclude='../node_modules' --exclude="../.git" -czvf service.tar.gz ../

gcloud compute scp service.tar.gz $1:~

gcloud compute ssh --command="mkdir -p about && tar -xzvf service.tar.gz -C about" $1