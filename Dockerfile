FROM ubuntu:18.04

ENV DEBIAN_FRONTEND noninteractive

# Install apache, php7.3, php interbase/firebird module
RUN \
  apt-get update && \
  apt install -y software-properties-common && \
  export LANG=C.UTF-8 && \
  add-apt-repository -y -u ppa:ondrej/php && \
  apt-get install -y  vim bash-completion wget ca-certificates && \
  apt-get update && \
  apt-get install -y apache2 && \  
  apt-get install -y curl && \ 
  apt install -y zip unzip  && \ 
  apt install -y git && \ 
  apt-get install -y php8.1 && \
  apt-get install -y php8.1-common php8.1-curl php8.1-dom php8.1-bcmath openssl php8.1-mbstring php8.1-pgsql php8.1-xml php8.1-interbase && \
  apt-get install -y libapache2-mod-php8.1 && \
  mkdir -p /etc/supervisor/conf.d/ && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/* && \
  curl -sS https://getcomposer.org/installer | php  && \
  mv composer.phar /usr/local/bin/composer && \
  chmod +x /usr/local/bin/composer && \
  a2enmod rewrite && \
  mkdir -p  /etc/apache2/from-host && \
  echo "" >> /etc/apache2/apache2.conf \
    && echo "# Include the configurations from the host machine" >> /etc/apache2/apache2.conf \
    && echo "IncludeOptional from-host/*.conf" >> /etc/apache2/apache2.conf &&\
  touch /etc/apache2/sites-available/prello.conf &&\
  echo "Include  /etc/apache2/from-host/prello.conf" >> /etc/apache2/sites-available/prello.conf && \
  a2dissite 000-default.conf &&\
  a2ensite prello.conf
  
##set postgresql settings
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - 
RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" | tee  /etc/apt/sources.list.d/pgdg.list 
RUN apt-get update && apt-get install -y postgresql-13 postgresql-client-13 postgresql-contrib-13

USER postgres
RUN    /etc/init.d/postgresql start &&\
    psql --command "CREATE USER prello WITH SUPERUSER PASSWORD 'prello';" &&\
    createdb -O prello prello

RUN echo "host all  all    0.0.0.0/0  md5" >> /etc/postgresql/13/main/pg_hba.conf
RUN echo "listen_addresses='*'" >> /etc/postgresql/13/main/postgresql.conf

VOLUME  ["/etc/postgresql", "/var/log/postgresql", "/var/lib/postgresql"]
###
USER root


RUN apt-get -y install supervisor && \
  mkdir -p /var/log/supervisor && \
  mkdir -p /etc/supervisor/conf.d
ADD supervisor.conf /etc/supervisor.conf

#change working directory to root of apache webhost
WORKDIR /var/www/html/



EXPOSE 80
EXPOSE 5432

#postgresql and apache 2 service
CMD ["supervisord", "-c", "/etc/supervisor.conf"]
