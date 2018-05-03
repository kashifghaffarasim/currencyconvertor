class WelcomesController < ApplicationController

    skip_before_action :verify_authenticity_token, only: [:create]





	def index
	    	@a = OpenExchangeRates::Rates.new(:app_id => "c3cb487c7b7c438ca56a557cf9d36996")
	end


	def new
	    	@a = OpenExchangeRates::Rates.new(:app_id => "c3cb487c7b7c438ca56a557cf9d36996")
	end


	def create

     	@a = OpenExchangeRates::Rates.new(:app_id => "c3cb487c7b7c438ca56a557cf9d36996")

 		check = @a.convert(params[:price].to_f, :from => params[:con], :to => params[:res])
		puts"===================================", params.inspect

		# @curr = params[:con]
		# @converted = params[:res]
		# @first_value = params[:price].to_f
		  # render'index', passed_parameter: params[:price]
		  render json: check

		# @a.convert(123.45, :from => "USD", :to => "EUR")


	end


	# private

	# 	def conversion
			
 #     	@a = OpenExchangeRates::Rates.new(:app_id => "c3cb487c7b7c438ca56a557cf9d36996")


	# check = @a.convert(params[:price].to_f, :from => params[:con], :to => params[:res])
 #    @curr = params[:price].to_f
    
 #    @converted_to = params[:con]
 #    @result = params[:res]

 #    puts "=====@curr=====", @curr.inspect
 #    puts "=====@converted_to=====", @converted_to.inspect
 #    puts "=====@result======", @result.inspect
 #    	end
end
