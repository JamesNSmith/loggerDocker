class UsersController < ApplicationController
  before_action :require_user, only: :profile
  #before_action :require_admin, only: :index

	def index
    case request.method_symbol
    when :get
      @users = User.all.paginate(page: params[:page],per_page: 10)
    when :post
      @user = User.find_by_id(params[:user][:id]) 
      if @user
        set_user(@user)
        @clubs = @user.clubs
        if @clubs[0]
          set_club(@clubs[0])   #----------dodgy---------------
        else
          end_club
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

      if User.find_by(email: user_params[:email])
        flash[:danger] = "Email already in use!"
        redirect_to '/users/signup'
      elsif @user.save
        #session[:user_id] = @user.id??????------------------------
        UserMailer.registration_confirmation(@user).deliver
        flash[:success] = "Please confirm your email address to continue"
        redirect_to '/'
      else
        flash[:danger] = "Ooooppss, something went wrong!"
        redirect_to '/users/signup'
      end
    end
  end

  def send_registration_confirmation
    @user = User.find(params[:user][:id])
    UserMailer.registration_confirmation(@user).deliver
    redirect_to '/users', :info => 'Email Sent'
  end

  def profile
    @user = current_user
  end
  
  private
  def user_params
    params.require(:user).permit(:first_name, :last_name, :username, :email, :password,:password_confirmation)
  end
end
