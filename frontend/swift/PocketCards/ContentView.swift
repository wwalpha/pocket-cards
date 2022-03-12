//
//  ContentView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
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
//        FlashCard(question: "Front Side", answer: "Back Side") { correct in
//            print(correct)
//        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
