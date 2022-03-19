//
//  LanguageHomeRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class LanguageHomeRouter {
    func makeStudyiew() -> some View {
        return DailyStudyView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeTestView() -> some View {
        return DailyTestView(subject: SUBJECT.LANGUAGE).configureView()
    }
}
