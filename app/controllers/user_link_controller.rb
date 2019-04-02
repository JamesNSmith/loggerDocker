class UserLinkController < ApplicationController
# Authenticate user
  def new
  	@user = User.find_by_email_confirm_token!(params[:format])
    if @user
      @user.email_activate
      #session[:user_id] = @user.id #not sure
      #redirect_to '/'
      redirect_to '/login', :success => "Welcome to FlightLogger! Your email has been confirmed.
      Please sign in to continue."
    else
      redirect_to '/', :danger => "Sorry. User does not exist"
    end
  end
# Recover Password
  def show
  	case request.method_symbol
    when :get
    when :post
    	user = User.find_by_email(params[:email])
  		user.send_password_reset if user
  		redirect_to '/', :info => "Email sent with password reset instructions."
  	end
  end

  def edit
  	case request.method_symbol
    when :get
  		@user = User.find_by_password_reset_token!(params[:id])
  	when :post
  		@user = User.find_by_password_reset_token!(params[:id])

  		if @user.password_reset_sent_at < 2.hours.ago
  			redirect_to new_password_reset_path, :danger => "Password reset has expireed."
  		elsif @user.update_attributes(user_params) ##:password => params[:password], :password_confirmation => params[:password_confirmation]
  			redirect_to '/', :success => "Password has been reset!"
  		else
  			render :edit
  		end
  	end
  end

  private
  def user_params
    params.require(:user).permit(:password,:password_confirmation)
  end
end
