FROM ruby:3.1.2-alpine

RUN mkdir -p /app
WORKDIR /app

ADD Gemfile /app/Gemfile
ADD Gemfile.lock /app/Gemfile.lock

RUN apk add --no-cache \
  git \
  bash \
  build-base \
  libxml2-dev \
  libxslt-dev \
  tzdata \
  openssl \
  gcompat

RUN bundle config build.nokogiri --use-system-libraries &&\
 bundle install

CMD ["ruby ./app.rb"]
