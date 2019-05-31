FROM ruby:2.3

WORKDIR /app
COPY . /app

RUN apt-get update -qq && apt-get install -y mysql-client \
	&& gem install rails -v 5.1.3 \
	&& gem install bundler -v 2.0.1 \
	&& bundle install

RUN apt-get update -qq \
	&& apt-get install -y curl \
	&& curl -sL https://deb.nodesource.com/setup_10.x | bash - \
	&& apt-get install -y nodejs \ 
	&& curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
	&& echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list \
	&& apt-get update \
	&& apt-get install -y apt-utils \
	&& apt-get install -y yarn \
	&& yarn install --check-files \
	&& bundle \
	&& bundle exec rails webpacker:install \
	&& bundle exec rails webpacker:install:react \
	&& yarn add core-js@3 \
	&& bundle exec rails assets:precompile

#&& rails generate react:install 
#nodejs=6.14.4

#RUN npm install react-bootstrap bootstrap

# Add a script to be executed every time the container starts.
#COPY entrypoint.sh /usr/bin/
#RUN chmod +x /usr/bin/entrypoint.sh
#ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Start the main process.
CMD ["rails", "server", "-b", "0.0.0.0"]