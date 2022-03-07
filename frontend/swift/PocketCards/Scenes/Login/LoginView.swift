//
//  LoginView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI
import Amplify

struct LoginView: View {
    @EnvironmentObject var auth: Authentication
    
    var body: some View {
        VStack {
            HStack {
                Button("Hello, world!") {
                    auth.signIn()
                }
                .padding()
                
            }
        }
        
    }
}
