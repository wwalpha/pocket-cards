//
//  ContentView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

struct ContentView: View {
    var body: some View {
        if (Auth.isSignedIn) {
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
