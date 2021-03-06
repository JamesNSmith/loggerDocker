class UsersController < ApplicationController
  before_action :require_user, only: [:index, :profile]
  #before_action :require_admin, only: :index if ENV["RAILS_ENV"] != 'development'

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
      @status = {first_name:'',middle_name:'',last_name:'',username:'',email:'',password:'',passeord_confirmation:'',tsandcs:''}
      @ticked = false
    when :post
      logger.debug 'post'
      @user = User.new(user_params)
      @status = {first_name:'',middle_name:'',last_name:'',username:'',email:'',password:'',passeord_confirmation:'',tsandcs:''}
      @ticked = params[:tsandcs]
      logger.debug 'post2'

      if params[:tsandcs]
        logger.debug 'presave'
        if @user.save
          logger.debug '@mailer'

          @mailer = UserMailer.registration_confirmation(@user).deliver
          logger.debug @mailer
          if @mailer
            logger.debug 'emailed'
          else
            logger.debug 'not emailed'
          end
          redirect_to '/', :success => "Please confirm your email address to continue"
        else
          @user.errors.each do |attr, msg|
            @status[attr] = 'error'
          end
          #flash[:danger] = "Oops, something went wrong!"
          logger.debug 'errors'
        end

      else
        @status[:tsandcs] = 'error'
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
    params.require(:user).permit(:first_name, :middle_name, :last_name, :username, :email, :password,:password_confirmation)
  end
end
