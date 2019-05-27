class MembershipsController < ApplicationController
  before_action :require_user
  before_action :require_club, only: [:show,:new,:update]

  def index
	  @memberships = Membership.all.paginate(page: params[:page],per_page: 10)
  end

  def show
    @club = current_club()
    @currentClubUser = current_user.club_users.find_by(club: @club)
    @memberships = current_club.memberships.paginate(page: params[:page],per_page: 10)
  end

  def new
    case request.method_symbol
    when :get
  	  @membership = Membership.new
      @status = {name:'',launch_fee:'',aerotow_standard_fee:'',aerotow_unit_fee:'',soaring_fee:''}
    when :post
      @membership = Membership.new(new_member_params)
      @status = {name:'',launch_fee:'',aerotow_standard_fee:'',aerotow_unit_fee:'',soaring_fee:''}
      
      if @membership.save && current_club
      	current_club.memberships << [@membership]
        redirect_to '/memberships/club', :info => @membership[:name].to_s + ' Membership Created'
      else
        @membership.errors.each do |attr, msg|
          @status[attr] = 'error'
        end
      end
    end
  end

  def update
    case request.method_symbol
    when :get
      @membership = Membership.find(params[:id])
      @status = {name:'',launch_fee:'',aerotow_standard_fee:'',aerotow_unit_fee:'',soaring_fee:''}
      check_admin_membership(@membership.club)
    
    when :post
      @membership = Membership.find(update_data_params[:id])
      @status = {name:'',launch_fee:'',aerotow_standard_fee:'',aerotow_unit_fee:'',soaring_fee:''}
      check_admin_membership(@membership.club)
      
      if @membership.update(update_data_params)
        redirect_to '/memberships/club', :info =>  @membership[:name].to_s + ' Membership Updated'  
      else
        @membership.errors.each do |attr, msg|
          @status[attr] = 'error'
        end
      end
    end
  end

  def delete
    @membership = delete_member_params
    Membership.find(@membership[:id]).destroy
    redirect_to '/memberships/club', :info =>  @membership[:name].to_s + ' Membership Removed'
  end

  private
  def new_member_params
    params.require(:membership).permit(:name, :launch_fee, :soaring_fee,:aerotow_standard_fee, :aerotow_unit_fee)
  end

  def update_data_params
    params.require(:membership).permit(:id, :launch_fee, :soaring_fee,:aerotow_standard_fee, :aerotow_unit_fee)
  end

  def delete_member_params
    params.require(:membership).permit(:id,:name)
  end
end