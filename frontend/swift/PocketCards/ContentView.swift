//
//  ContentView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var auth: Authentication

    var body: some View {
        if (auth.isSignedIn) {
            NavigationView {
                RootView().configureView()
            }
            .navigationViewStyle(StackNavigationViewStyle())
        } else {
            LoginView()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
