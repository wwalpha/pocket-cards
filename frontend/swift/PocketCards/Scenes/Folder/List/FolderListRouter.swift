//
//  FolderListRouter.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/11.
//

import SwiftUI

final class FolderListRouter {
    
    func makeDetailView() -> some View {
        StudyHomeView(presenter: StudyHomePresenter())
//        FolderItemView()
    }
    
    func makeAddFolderView() -> some View {
        FolderItemView()
    }
}
