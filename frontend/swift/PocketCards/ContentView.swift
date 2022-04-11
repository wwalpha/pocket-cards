//
//  ContentView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

struct ContentView: View {
    @EnvironmentObject var auth: Authentication

    init() {
        UITabBar.appearance().backgroundColor = UIColor(Color.grey100)
    }

    var body: some View {
        if auth.isSignedIn {
            VStack {
                TabView {
                    NavigationView {
                        RootView().configureView()
                    }
                    .navigationViewStyle(StackNavigationViewStyle())
                    .tabItem {
                        Image(systemName: "house")
                    }

                    DailyTasksView().configureView()
                        .tabItem {
                            Image(systemName: "gear")
                        }

                    HistoriesView().configureView()
                        .tabItem {
                            Image(systemName: "chart.bar")
                        }
                }
                .onAppear {
                    let standardAppearance = UITabBarAppearance()
                    standardAppearance.backgroundColor = UIColor(Color.gray)
                    standardAppearance.shadowColor = UIColor(Color.black)

                    let itemAppearance = UITabBarItemAppearance()
//                    itemAppearance.normal.iconColor = UIColor(Color.white)
                    itemAppearance.selected.iconColor = UIColor(Color.red)

                    standardAppearance.inlineLayoutAppearance = itemAppearance
                    standardAppearance.stackedLayoutAppearance = itemAppearance
                    standardAppearance.compactInlineLayoutAppearance = itemAppearance

                    UITabBar.appearance().standardAppearance = standardAppearance
                }
            }.edgesIgnoringSafeArea(.bottom)
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
