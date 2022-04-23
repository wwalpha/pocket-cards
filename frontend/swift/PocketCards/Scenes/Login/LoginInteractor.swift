//
//  LoginViewInteractor.swift
//  PocketCards
//
//  Created by macmini on 2022/04/23.
//
//

import Foundation

class LoginInteractor {
    var presenter: LoginPresentationLogic?
}

extension LoginInteractor: LoginBusinessLogic {
    func login(username: String, password: String) {
        let params = [
            "username": username,
            "password": password,
        ]

        API.request(URLs.SIGN_IN, method: .post, parameters: params)
            .response { response in

                debugPrint("response", response)
                switch response.result {
                case .success:
                    print("Successful")

                case let .failure(error):
                    print(error)
                }
            }
    }
}
