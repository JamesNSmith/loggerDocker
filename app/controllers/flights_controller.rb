class FlightsController < ApplicationController
	before_action :require_user #, only: [:index, :show]

	#def index
    #  	@flight_dates = Flight.select(:launch_date).distinct.order(launch_date: :desc)
	#end

	#def show
	#	@date = params[:launch_date]
	#	@date_flights = Flight.where(launch_date: @date ).order(launch_time: :desc)
	#end

	
end
