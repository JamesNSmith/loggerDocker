class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  #force_ssl 

  add_flash_types :danger, :info, :warning, :success

  helper_method :set_user, :current_user, :end_user, :set_club, :current_club, :end_club, :check_user_membership, :check_admin_membership   

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  #User ------------------------------------
  def set_user(user)
    session[:user_auth] = user.auth_token
  end 

  def current_user 
    begin 
      @current_user ||= User.find_by(auth_token: session[:user_auth]) if session[:user_auth]
    rescue ActiveRecord::RecordNotFound => e
      false
    end 
  end
  
  def require_user 
  	redirect_to '/login?url=' + request.original_url, :warning => 'User Required'  unless current_user 
  end

  def require_admin
    begin 
      if current_user.utype != 'webadmin'
        redirect_to '/', :warning => 'Website Admin Required' 
      end
    rescue NoMethodError => e
      require_user
    end
  end

  def end_user
    end_club
    session[:user_auth] = nil
  end

  #Club ------------------------------------
  def set_club(club)
    require_user
    session[:club_auth] = club.auth_token if club
  end 

  def current_club
    begin 
  	  @current_club ||= Club.find_by(auth_token: session[:club_auth]) if session[:club_auth]
    rescue ActiveRecord::RecordNotFound => e
      false
    end  
  end

  def require_club 
    redirect_to '/clubs/user', :warning => 'Club Required' unless current_club 
  end

  def end_club
    session[:club_auth] = nil
  end

  #Membership --------------------------------
  def check_user_membership(club,user)
    @user = current_user
    if @user != user 
      redirect_to '/', :danger => "Access Denied"
    else
      begin
        @utype = @user.club_users.find_by(club: club).utype
      rescue NoMethodError => e
        redirect_to '/', :danger => "Access Denied"
      end
    end
  end

  def check_admin_membership(club) 
    begin
      @utype = current_user.club_users.find_by(club: club).utype
      if @utype != 'admin'
        redirect_to '/', :danger => "Access Denied"
      end
    rescue NoMethodError => e
      redirect_to '/', :danger => "Access Denied"
    end
  end

  #Misc ---------------------------------------
  def record_not_found
    session[:user_auth] = nil
    session[:club_auth] = nil
    redirect_to '/', :danger => 'RECORD NOT FOUND'
  end
 
end
