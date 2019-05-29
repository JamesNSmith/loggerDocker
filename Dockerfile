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
	&& npm -v 

RUN apt-get install -y curl \
	&& curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
	&& echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
	&& apt-get update \
	&& apt-get install -y apt-utils \
	&& apt-get install -y yarn \
	&& yarn install --check-files \
	&& rails webpacker:install\  
	&& rails webpacker:install:react 
#&& rails generate react:install 

#RUN npm install react-bootstrap bootstrap

# Add a script to be executed every time the container starts.
#COPY entrypoint.sh /usr/bin/
#RUN chmod +x /usr/bin/entrypoint.sh
#ENTRYPOINT ["entrypoint.sh"]
EXPOSE 587 3000 3306

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]
