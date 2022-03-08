//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {
    
    func makeLanguageHomeView() -> some View {
        return LanguageHomeView().configureView()
    }

    func makeScienceHomeView() -> some View {
        return ScienceHomeView().configureView()
    }

    func makeSocietyHomeView() -> some View {
        return SocietyHomeView().configureView()
    }
}
