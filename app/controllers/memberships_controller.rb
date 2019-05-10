class MembershipsController < ApplicationController
  before_action :require_user
  before_action :require_club, only: [:show,:new,:update]

  def index
	  @memberships = Membership.all.paginate(page: params[:page],per_page: 10)
  end

  def show
    @club = current_club()
    @memberships = current_club.memberships.paginate(page: params[:page],per_page: 10)
  end

  def new
    case request.method_symbol
    when :get
  	  @membership = Membership.new
    when :post
      @membership = Membership.new(new_member_params)
      #@membership.club << current_club
      if @membership.save && current_club
      	current_club.memberships << [@membership]
        redirect_to '/memberships/club'
      else
        redirect_to '/membership/add'
      end
    end
  end

  def update
    case request.method_symbol
    when :get
      @membership = Membership.find(update_params[:id])
    when :post
      @membership = Membership.find(update_data_params[:id])
      @membership.update(update_data_params)
      redirect_to '/memberships/club', :info =>  @membership[:name].to_s + ' Membership Updated'
    end
  end

  def delete
    @membership = delete_member_params
    Membership.find(@membership[:id]).destroy
    redirect_to '/memberships/club', :info =>  @membership[:name].to_s + ' Membership Removed'
  end

  private
  def new_member_params
    params.require(:membership).permit(:name, :mtype, :launch_fee, :soaring_fee,:aerotow_standard_fee, :aerotow_unit_fee)
  end

  def update_params
    params.require(:membership).permit(:id)
  end

  def update_data_params
    params.require(:membership).permit(:id, :mtype, :launch_fee, :soaring_fee,:aerotow_standard_fee, :aerotow_unit_fee)
  end

  def delete_member_params
    params.require(:membership).permit(:id,:name)
  end
end
