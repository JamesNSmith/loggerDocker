Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  root 'pages#index'
  match '/termsandconditions', to: 'pages#tsandcs', via: :get 

  match '/users/admin', to: 'users#index', via: [:get, :post]
  match '/users/signup', to: 'users#new', via: [:get, :post]
  match '/users/profile', to: 'users#profile', via: [:get]
  match '/users/send_registration_confirmation', to: 'users#send_registration_confirmation', via: [:post]

  match '/clubs/admin', to: 'clubs#index', via: [:get, :post]
  match '/clubs/add', to: 'clubs#new', via: [:get, :post]
  delete '/clubs/del' => 'clubs#destroy'
  match '/clubs/members', to: 'clubs#show', via: :get
  match '/clubs/user', to: 'clubs#view', via: [:get, :post]
  match '/clubs/profile', to: 'clubs#profile', via: [:get]

  match '/clubusers/update/:id', to: 'club_users#userupdate', via: [:get, :post], as: :clubusers_update
  match '/clubusers/adminupdate/:id', to: 'club_users#adminupdate', via: [:get, :post], as: :clubusers_adminupdate
  match '/clubusers/delete', to: 'club_users#delete', via: :post
  match '/clubusers/leave', to: 'club_users#leave', via: :post

  match '/memberships/admin', to: 'memberships#index', via: :get
  match '/memberships/club', to: 'memberships#show', via: :get
  match '/memberships/add', to: 'memberships#new', via: [:get, :post]
  match '/memberships/update/:id', to: 'memberships#update', via: [:get, :post], as: :memberships_update
  match '/memberships/delete', to: 'memberships#delete', via: :post

  match '/club_link/update', to: 'club_link#update', via: :post #????????

  match '/demologger', to: 'logger#demoLogger', via: :get

  get '/login' => 'sessions#new'
  post '/login' => 'sessions#create'
  delete 'logout' => 'sessions#destroy'

  resources :users
  resources :password_resets
  resources :user_authentication
  resources :club_link

end

#resources :sessions
