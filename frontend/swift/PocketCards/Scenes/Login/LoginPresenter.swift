//
//  LoginPresenter.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/13.
//

import Foundation

final class LoginPresenter: ObservableObject {
    private let appState: AppState
    
    init(appState:AppState) {
        self.appState = appState
    }
    
    func login() {
        appState.isLogin = true
    }
}
