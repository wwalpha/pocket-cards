//
//  RootRouter.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI

class RootRouter {
    func makeLanguageStudyiew() -> some View {
        DailyStudyView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeLanguageTestView() -> some View {
        DailyTestView(subject: SUBJECT.LANGUAGE).configureView()
    }

    func makeScienceStudyiew() -> some View {
        DailyStudyView(subject: SUBJECT.SCIENCE).configureView()
    }

    func makeScienceTestView() -> some View {
        DailyTestView(subject: SUBJECT.SCIENCE).configureView()
    }

    func makeSocietyStudyiew() -> some View {
        DailyStudyView(subject: SUBJECT.SOCIETY).configureView()
    }

    func makeSocietyTestView() -> some View {
        DailyTestView(subject: SUBJECT.SOCIETY).configureView()
    }
}
