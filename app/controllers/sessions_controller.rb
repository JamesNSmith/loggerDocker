class SessionsController < ApplicationController
  def new
    @email = params[:email]
    @redirect = params[:url]
  end

  def create
    @email = params[:session][:email]
    @redirect = params[:session][:redirectUrl] 
    @user = User.find_by_email(params[:session][:email]) 

    if @user && @user.authenticate(params[:session][:password])
      if @user.email_confirmed
        set_user(@user)
        set_club(@user.clubs.first)#dodgy
        
        if @redirect
          redirect_to @redirect
        else
          redirect_to '/'
        end 
      else
        #UserMailer.registration_confirmation(@user).deliver # dodgy
        redirect_to '/', :danger => 'Please activate your account by following the instructions in the account confirmation email'
      end
     
    else
      @url = []
      if @email != ''
        @url.push('email='+@email)
      end

      if @redirect != ''
        @url.push('url='+@redirect)
      end

      if @url.length > 1
        @urlString = @url.join('&&')
      elsif @url.length == 1
        @urlString = @url[0]
      else
        @urlString = '' 
      end

      @urlDirect = '/login'
      if @urlString != ''
        @urlDirect += '?'+@urlString
      end
        
      redirect_to @urlDirect, :danger => 'Invalid email/password combination' # Not quite right!
    end
	end

	def destroy 
  	#end_club
    end_user  
  	redirect_to '/', :info => "Logged out!" 
	end
end
