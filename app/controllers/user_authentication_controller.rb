class UserAuthenticationController < ApplicationController
  def show
  	@user = User.find_by_email_confirm_token!(params[:id])
    if @user
      @user.email_activate
      #session[:user_id] = @user.id #not sure
      #redirect_to '/'
      redirect_to '/login?email=' + @user.email, :success => "Welcome to FlightLogger! Your email has been confirmed.
      Please sign in to continue."
    else
      redirect_to '/', :danger => "Sorry. User does not exist"
    end
  end
end

