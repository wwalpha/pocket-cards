//
//  LoginView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import Amplify
import SwiftUI

struct LoginView: View {
    @EnvironmentObject var auth: Authentication

    var body: some View {
        VStack {
            HStack {
                Button {
                    auth.signIn()
                } label: {
                    Text("Sign In")
                        .frame(width: 240, height: 64, alignment: .center)
                        .font(.title)
                        .padding()
                        .foregroundColor(Color.white)
                        .background(Color.society)
                }

                Button {
                    auth.signOut()
                } label: {
                    Text("Sign Out")
                        .frame(width: 240, height: 64, alignment: .center)
                        .font(.title)
                        .padding()
                        .foregroundColor(Color.white)
                        .background(Color.society)
                }
            }
        }
    }
}
