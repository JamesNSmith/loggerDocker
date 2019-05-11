class SessionsController < ApplicationController
  @@status = ''

  def new
    @status = @@status
    @email = params[:email]
    @redirect = params[:url]
  end

  def create 
    @user = User.find_by_email(params[:session][:email]) 
    if @user && @user.authenticate(params[:session][:password])
      if @user.email_confirmed
        set_user(@user)
        set_club(@user.clubs.first)#dodgy
        #if @clubs.length > 0 
        #  session[:club_auth] = @clubs.first.auth_token #dodgy
        #end
        
        if params[:session][:redirectUrl]
          redirect_to params[:session][:redirectUrl]
        else
          redirect_to '/'
        end 
      else
        #UserMailer.registration_confirmation(@user).deliver # dodgy
        redirect_to '/', :danger => 'Please activate your account by following the instructions in the account confirmation email'
      end
     
      @@status = ''
      #redirect_to '/'
      #redirect_back(fallback_location: '/') 
    else
      @@status = "error"
      redirect_to '/login', :danger => 'Invalid email/password combination' # Not quite right!
    end
	end

	def destroy 
  	#end_club
    end_user  
  	redirect_to '/', :info => "Logged out!" 
	end
end
