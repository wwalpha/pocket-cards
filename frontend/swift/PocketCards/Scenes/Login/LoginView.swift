//
//  LoginViewView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/23.
//
//

import SwiftUI

struct LoginView: View {
    var interactor: LoginBusinessLogic?
    @State private var username = "max2020"
    @State private var password = "Session10+"

    var body: some View {
        VStack(alignment: .center, spacing: 15) {
            Spacer()

            Text("Pocket Cards")
                .font(.largeTitle).foregroundColor(Color.white)
                .padding([.top, .bottom], 40)

//            Image("iosapptemplate")
//                .resizable()
//                .frame(width: 250, height: 250)
//                .clipShape(Circle())
//                .overlay(Circle().stroke(Color.white, lineWidth: 4))
//                .shadow(radius: 10)
//                .padding(.bottom, 50)

            TextField("Username", text: $username)
                .padding()
                .background(Color.white)
                .cornerRadius(20.0)

            SecureField("Password", text: $password)
                .padding()
                .background(Color.white)
                .cornerRadius(20.0)

            Button(action: {
                interactor?.login(username: username, password: password)

            }, label: {
                Text("Sign In")
                    .font(.headline)
                    .foregroundColor(.white)
                    .padding()
                    .frame(width: 300, height: 50)
                    .background(Color.green)
                    .cornerRadius(15.0)
            }).padding()

            Spacer()
        }
        .padding([.leading, .trailing], 27.5)
        .background(
            LinearGradient(gradient: Gradient(colors: [.purple, .blue]), startPoint: .top, endPoint: .bottom)
                .edgesIgnoringSafeArea(.all))
    }
}

extension LoginView: LoginDisplayLogic {}

extension LoginView {
    func configureView() -> some View {
        var view = self
        let interactor = LoginInteractor()
        let presenter = LoginPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        return view
    }
}

struct LoginViewView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
    }
}
