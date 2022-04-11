//
//  LanguageHomeRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class LanguageHomeRouter {
    func makeStudyiew() -> some View {
        DailyStudyView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeTestView() -> some View {
        DailyTestView(subject: SUBJECT.LANGUAGE).configureView()
    }
}
