class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  #force_ssl 

  add_flash_types :danger, :info, :warning, :success

  helper_method :current_user, :current_club  

  #User ------------------------------------
  def current_user 
  	@current_user ||= User.find(session[:user_id]) if session[:user_id] 
  end
  
  def require_user 
  	redirect_to '/login', :warning => 'user required' unless current_user 
  end

  #Club ------------------------------------
  def current_club 
  	@current_club ||= Club.find(session[:club_id]) if session[:club_id] 
  end

  def require_club 
    redirect_to '/login', :warning => 'club required' unless current_club 
  end
end
