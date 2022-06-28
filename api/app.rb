# frozen_string_literal: true

require 'dotenv/load'

require 'sinatra'
require 'sinatra/reloader' if development?

require 'redis'

require 'stripe'
require 'lago-ruby-client'

require 'json'

Stripe.api_key = ENV['STRIPE_SECRET_KEY']

set :bind, '0.0.0.0'

######################
# CORS
######################

before do
  content_type :json
  headers 'Access-Control-Allow-Origin' => '*',
          'Access-Control-Allow-Methods' => %w[OPTIONS GET POST],
          'Access-Control-Allow-Headers' => 'Content-Type'
end

set :protection, false

options '/customer' do
  200
end

options '/customer/:id' do
  200
end

options '/secret/:id' do
  200
end

######################
# Routes
######################

get '/' do
  {
    status: 'all good',
    redis: redis.info,
  }.to_json
end

post '/customer' do
  json = JSON.parse(request.body.read, symbolize_names: true)
  logger.info json

  customer = {
    customer_id: json[:customer_id],
    email: json[:email],
    name: json[:name]
  }

  lago_customer = lago_client.customers.create(customer)
  customer[:lago_id] = lago_customer.lago_id

  store_customer(customer)

  logger.info customer
  render_customer(customer)
end

get '/customer/:id' do
  customer = retrieve_customer(params[:id])

  return halt 404 unless customer

  logger.info customer
  render_customer(customer)
end

post '/webhooks' do
  response = JSON.parse(request.body.read)
  logger.info response

  case response['webhook_type']
  when 'customer.payment_provider_created'
    update_stripe_customer_id(response['customer'])
  when 'customer.payment_provider_error'
    set_customer_error(response['payment_provider_customer_error'])
  when 'invoice.payment_failure'
    set_customer_error(response['payment_provider_invoice_payment_error'])
  end

  halt 200
end

get '/secret/:customer_id' do
  customer = retrieve_customer(params[:customer_id])
  intent = create_setup_intent(customer[:stripe_customer_id])

  customer[:intent_secret] = intent.client_secret
  store_customer(customer)

  logger.info intent.client_secret
  { client_secret: intent.client_secret }.to_json
end

######################
# Private methods
######################

private

def redis
  @redis ||= Redis.new(url: ENV['REDIS_URL'])
end

def store_customer(customer)
  redis.set(customer[:customer_id], customer.to_json)
end

def retrieve_customer(customer_id)
  result = redis.get(customer_id)
  JSON.parse(result, symbolize_names: true) if result
end

def lago_client
  @lago_client ||= Lago::Api::Client.new(api_key: ENV['LAGO_API_KEY'], api_url: ENV['LAGO_API_URL'])
end

def create_setup_intent(stripe_customer_id)
  Stripe::SetupIntent.create(
    customer: stripe_customer_id,
    payment_method_types: ['card']
  )
end

def update_stripe_customer_id(lago_customer)
  customer = retrieve_customer(lago_customer['customer_id'])
  customer[:stripe_customer_id] = lago_customer['billing_configuration']['provider_customer_id']

  store_customer(customer)
end

def render_customer(customer)
  {
    customer_id: customer[:customer_id],
    lago_customer_id: customer[:lago_id],
    stripe_customer_id: customer[:stripe_customer_id],
    stripe_error: customer[:stripe_error]
  }.to_json
end

def set_customer_error(stripe_error)
  customer = retrieve_customer(stripe_error['customer_id'] || stripe_error['lago_customer_id'])
  customer[:stripe_error] ||= stripe_error['provider_error']

  store_customer(customer)
end
