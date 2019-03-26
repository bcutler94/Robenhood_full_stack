class Api::SessionsController < ApplicationController

    def show
    end

    def create
        # debugger
        @user = User.find_by_credentials(params[:user][:email], params[:user][:password])
        if @user
            login!(@user)
            render :show
        else
            render json: ["Invalid username/password"], status: 401
        end
    end

    def destroy
        @user = current_user
        if @user
            logout
            render :show
        else
            render json: ['Nobody signed in'], status: 404
        end
    end
end