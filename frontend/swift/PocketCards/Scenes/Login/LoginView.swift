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
                Button("Sign In") {
                    auth.signIn()
                }
                .frame(width: 240, height: 64, alignment: .center)
                .font(.title)
                .padding()
                .foregroundColor(Color.white)
                .background(Color.society)
                
            }
        }
        
    }
}
