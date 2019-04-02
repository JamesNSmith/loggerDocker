class SessionsController < ApplicationController
  @@status = ''

  def new
    @status = @@status
  end

  def create 
    @user = User.find_by_email(params[:session][:email]) 
    if @user && @user.authenticate(params[:session][:password])
      if @user.email_confirmed
        session[:user_id] = @user.id
        @clubs = @user.clubs
        puts 'Club:'
        puts @clubs
        if @clubs.length > 0 
          puts @club
          session[:club_id] = (@clubs.first)['id'] #dodgy
        end 

      else
        #UserMailer.registration_confirmation(@user).deliver # dodgy
        flash.now[:danger] = 'Please activate your account by following the instructions in the account confirmation email you received to proceed'
      end
     
      @@status = ''
      redirect_to '/'
      #redirect_back(fallback_location: '/') 
    else 
      @@status = "error"
      redirect_to '/login', :danger => 'Invalid email/password combination' # Not quite right!
    end
	end

	def destroy 
  	session[:user_id] = nil
    session[:club_id] = nil  
  	redirect_to '/', :info => "Logged out!" 
	end
end
