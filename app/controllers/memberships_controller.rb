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

#<%= form_for(:membership, url: '/memberships/delete') do |f| %> 
#      <%= f.hidden_field :id, value: membership.id %>
#      <%= f.hidden_field :name, value: membership.name %>
#      <%= f.submit "Delete", class: "btn" %>
#      <% end %>

#
#
#'/memberships/delete'
#<%= link_to 'Remove', clubusers_delete_path(:club_user => { id: @clubUser.id, first_name: @clubUser.user.first_name, last_name: @clubUser.user.last_name}), method: :post, :data => { confirm: 'Are you sure?' }, class: "btn" %> 
#<%= form_for(:club_user, url: '/clubusers/delete') do |f| %>
#      <%= f.hidden_field :id, value: @clubUser.id %>
#      <%= f.hidden_field :first_name, value: @clubUser.user.first_name %>
#      <%= f.hidden_field :last_name, value: @clubUser.user.last_name %>
#      <%= f.submit "Remove", class: "btn" %>
#      <% end %>

#<%= form_for(:club_user, url: '/clubusers/leave') do |f| %> 
#        <%= f.hidden_field :id, value: @clubUser.id %>
#        <%= f.hidden_field :club_id, value: club.id %>
#        <%= f.hidden_field :club, value: club.name %>
#        <%= f.submit "Leave", class: "btn" %>
#        <% end %>

#<%= form_for(:membership, url: '/memberships/update', method: :get) do |f| %> 
#      <%= f.hidden_field :id, value: membership.id %>
#      <%= f.submit "Update", class: "btn" %>
#      <% end %>