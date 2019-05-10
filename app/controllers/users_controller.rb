class UsersController < ApplicationController
	def index
    case request.method_symbol
    when :get
      @users = User.all.paginate(page: params[:page],per_page: 10)
    when :post
      @user = User.find_by_id(params[:user][:id]) 
      if @user
        session[:user_id] = @user.id
        @clubs = @user.clubs
        if @clubs[0]
          session[:club_id] = @clubs[0].id   #----------dodgy---------------
        else
          session[:club_id] = nil
        end
        redirect_to '/' 
      end
    end
  end

  def new
    case request.method_symbol
    when :get
      @user = User.new
    when :post
      @user = User.new(user_params)
      if @user.save
        #session[:user_id] = @user.id??????------------------------
        UserMailer.registration_confirmation(@user).deliver
        flash[:success] = "Please confirm your email address to continue"
        redirect_to '/'
      else
        flash[:error] = "Ooooppss, something went wrong!"
        redirect_to '/signup'
      end
    end
  end
  
  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :username, :email, :password,:password_confirmation)
  end
end
