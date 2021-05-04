//
//  LoginView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/13.
//

import SwiftUI

struct LoginView: View {
    @ObservedObject var presenter: LoginPresenter
    
    @State var username: String = ""
    @State var password: String = ""
    
    init(appState: AppState) {
        self.presenter = LoginPresenter(appState: appState)
    }
    
    var accentColor: Color = Color.blue
    var grayBackground: Color = Color.gray.opacity(0.2)

    var body: some View {
        VStack {
            Text("PocketCards")
                .font(.largeTitle)
                .foregroundColor(.accentColor)
                .fontWeight(.semibold)
                .padding(.bottom, 20)
            
            TextField("Username", text: $username)
                .padding()
                .background(grayBackground)
                .cornerRadius(5.0)
                .padding(.bottom, 20)
            
            SecureField("Password", text: $password)
                .padding()
                .background(grayBackground)
                .cornerRadius(5.0)
                .padding(.bottom, 20)
            
            Button(action: {
                self.presenter.login()
            }, label: {
                Text("Sign In")
                    .font(.title2)
                    .foregroundColor(.white)
                    .padding()
                    .frame(width: 220, height: 60, alignment: .center)
                    .background(accentColor)
                    .cornerRadius(15.0)
            })
        }
        .padding()
    }
}

struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView(appState: AppState())
    }
}
