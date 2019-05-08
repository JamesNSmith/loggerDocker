FROM ruby:2.3

WORKDIR /app
COPY . /app

RUN apt-get update -qq && apt-get install -y nodejs mysql-client yarn
RUN gem install rails -v 5.2.3
RUN gem install bundler -v 2.0.1

RUN bundle install
RUN rails webpacker:install       
RUN rails webpacker:install:react 
RUN rails generate react:install

yarn add react-bootstrap bootstrap

# Add a script to be executed every time the container starts.
#COPY entrypoint.sh /usr/bin/
#RUN chmod +x /usr/bin/entrypoint.sh
#ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000 3306

# Start the main process.
RUN bundler -v
RUN rails -v
CMD ["rails", "server", "-b", "0.0.0.0"]
