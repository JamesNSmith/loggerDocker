FROM ruby:2.3

WORKDIR /app
COPY . /app

RUN apt-get update -qq && apt-get install -y mysql-client
RUN gem install rails -v 5.2.3
RUN gem install bundler -v 2.0.1
RUN bundle install
RUN apt-get update -qq \
	&& apt-get install -y curl \
	&& curl -sL https://deb.nodesource.com/setup_10.x | bash - \
	&& apt-get install -y nodejs #nodejs=6.14.4 \
	&& node -v \
	&& npm -v \

RUN rails webpacker:install  
RUN apt-get install -y curl \
	&& curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
	&& apt-get install -y yarn \
	&& rails webpacker:install:react \ 
	&& rails generate react:install \

#RUN npm install react-bootstrap bootstrap

# Add a script to be executed every time the container starts.
#COPY entrypoint.sh /usr/bin/
#RUN chmod +x /usr/bin/entrypoint.sh
#ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000 3306

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
