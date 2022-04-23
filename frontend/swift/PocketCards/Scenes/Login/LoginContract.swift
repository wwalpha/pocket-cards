//
//  LoginContract.swift
//  PocketCards
//
//  Created by macmini on 2022/04/23.
//
//

import Foundation

// View logic
protocol LoginDisplayLogic {}

// Interactor logic
protocol LoginBusinessLogic {
    func login(username: String, password: String)
}

// Presenter logic
protocol LoginPresentationLogic {}
