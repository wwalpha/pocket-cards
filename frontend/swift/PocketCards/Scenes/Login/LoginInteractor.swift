//
//  LoginViewInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/23.
//
//

class LoginInteractor {
    var presenter: LoginPresentationLogic?
}

extension LoginInteractor: LoginBusinessLogic {
    func login(username: String, password: String) {
        Auth.signInWithUser(username: username, password: password)
    }
}
