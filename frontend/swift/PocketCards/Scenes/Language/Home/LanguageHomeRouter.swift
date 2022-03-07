//
//  LanguageHomeRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class LanguageHomeRouter {
    
    func makeStudyiew() -> some View {
        return DailyStudyView().configureView()
    }
    
    func makeTestView() -> some View {
        return DailyStudyView()
    }
}
