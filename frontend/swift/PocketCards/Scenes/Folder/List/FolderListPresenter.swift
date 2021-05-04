//
//  FolderPresenter.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/11.
//

import SwiftUI
import Combine

class FolderListPresenter: ObservableObject {
    private let interactor = FolderListInteractor()
    private let router = FolderListRouter()
    
    @Published var folders: [Folder] = []
    
    func linkBuilder<Content: View>(ViewBuilder content: () -> Content) -> some View {
        NavigationLink(destination: router.makeDetailView()) {
            content()
        }
    }
    
    func addFolder() -> some View {
        NavigationLink("New", destination: router.makeAddFolderView())
    }
}
