//
//  HomeTabView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/11.
//
import SwiftUI

struct HomeTabView: View {

    var body: some View {
        TabView {
            FolderListView(presenter: FolderListPresenter())
                .tabItem {
                    Image(systemName: "house")
                        .font(.title)
                }
                .tag(1)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape")
                        .font(.title)
                }
                .tag(2)
        }.accentColor(.purple)
    }
}

struct HomeTabView_Previews: PreviewProvider {
    static var previews: some View {
        HomeTabView()
    }
}
