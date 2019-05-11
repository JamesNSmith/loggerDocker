class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  #force_ssl 

  add_flash_types :danger, :info, :warning, :success

  helper_method :current_user, :current_club  

  rescue_from ActiveRecord::RecordNotFound, :with => :record_not_found

  #User ------------------------------------
  def current_user 
  	@current_user ||= User.find(session[:user_id]) if session[:user_id] 
  end
  
  def require_user 
  	redirect_to '/login', :warning => 'User Required' unless current_user 
  end

  #Club ------------------------------------
  def current_club
    begin 
  	  @current_club ||= Club.find(session[:club_id]) if session[:club_id]
    rescue ActiveRecord::RecordNotFound => e
      false
    end  
  end

  def require_club 
    redirect_to '/clubs/user', :warning => 'Club Required' unless current_club 
  end

  def record_not_found
    session[:user_id] = nil
    session[:club_id] = nil
    redirect_to '/login', :danger => 'RECORD NOT FOUND'# Assuming you have a template named 'record_not_found'
  end

  #Misc ---------------------------------------
  
end
