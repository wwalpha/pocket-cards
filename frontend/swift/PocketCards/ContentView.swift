//
//  ContentView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import AVFAudio
import SwiftUI

struct ContentView: View {
    @EnvironmentObject var auth: Authentication
    @State private var selection = 0

    init() {
        UITabBar.appearance().backgroundColor = UIColor(Color.grey100)
    }

    var body: some View {
        if auth.isSignedIn {
            VStack {
                TabView(selection: $selection) {
                    NavigationView {
                        RootView().configureView()
                    }
                    .navigationViewStyle(StackNavigationViewStyle())
                    .tabItem {
                        Image(systemName: "house")
                    }
                    .tag(0)

                    DailyTasksView().configureView()
                        .tabItem {
                            Image(systemName: "gear")
                        }
                        .tag(1)

                    OverallTimesView().configureView()
                        .tabItem {
                            Image(systemName: "eyes")
                        }
                        .tag(2)

                    HistoriesView().configureView()
                        .tabItem {
                            Image(systemName: "chart.bar")
                        }
                        .tag(3)

                    MultiTestView().configureView()
                        .tabItem {
                            Image(systemName: "gamecontroller")
                        }
                        .tag(2)
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
            #if DEBUG
                LoginSamlView()
            #endif

            #if CAT
                LoginSamlView()
            #endif

            #if DOG
                LoginView().configureView()
            #endif
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
