//
//  StudyHomePresenter.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/14.
//

import SwiftUI
import Combine

final class StudyHomePresenter: ObservableObject {
    private let router = StudyHomeRouter()
    
    func registHome<Content: View>(ViewBuilder content: () -> Content) -> some View {
        NavigationLink(destination: router.makeRegistHomeView()) {
            content()
        }
    }
    
    func studyCard<Content: View>(ViewBuilder content: () -> Content) -> some View {
        NavigationLink(destination: router.makeStudyCardView()) {
            content()
        }
    }
}
