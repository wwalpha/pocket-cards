//
//  Root.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/11.
//

import SwiftUI

struct RootView: View {
    @EnvironmentObject var state: AppState
    
    var body: some View {
        ZStack {
            if !state.isLogin {
                LoginView(appState: self.state)
            } else {
                HomeTabView()
//                FolderListView(presenter: FolderListPresenter())
            }
        }
    }
}

struct Root_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
    }
}
